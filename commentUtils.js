const queue = []

const JOB_KEY = Symbol("job_id")

let isFlushing;

const resolvedPromise = Promise.resolve();

let currentFlushPromise = null

export function queueJob(job) {
    const i = queue.findIndex(i => i === job || i[JOB_KEY] === job[JOB_KEY])
    if (i === -1) {
        job[JOB_KEY] = Date.now() + queue.length + 1
        queue.push(job);
    } else
        queue.splice(i, 1, job);

    queueFlush()
}

function queueFlush() {
    if (!isFlushing) {
        currentFlushPromise = resolvedPromise.then(flushJobs)
    }
}

function callWithErrorHandling(fn, args) {
    let res;
    try {
        res = args ? fn(...args) : fn();
    } catch (err) {
        console.warn(err)
    }
    return res;
}

function flushJobs(seen) {
    isFlushing = true
    seen = seen || new Map()
    const check = (job) => checkRecursiveUpdates(seen, job);
    try {
        for (let w = 0; w < queue.length; w++) {
            const cb = queue[w]
            if (check(cb)) {
                continue;
            }
            queue.splice(w, 1)
            w--
            callWithErrorHandling(cb)
        }
    } finally {
        queue.length = 0
        isFlushing = false
        if (queue.length) {
            queueFlush(seen)
        }
    }
}

const RECURSION_LIMIT = 100;

function checkRecursiveUpdates(seen, fn) {
    if (!seen.has(fn)) {
        seen.set(fn, 1);
    } else {
        const count = seen.get(fn);
        if (count > RECURSION_LIMIT) {
            log.warn1(
                `Maximum recursive updates`
            );
            return true;
        } else {
            seen.set(fn, count + 1);
        }
    }
}