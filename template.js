export function template() {
  return `
      <style>
        .div{
          color:red;
        }
      </style>
      <div class="div">
        <p>
          你好
        </p>
      </div>
      <div class=div key=1>
        <h1>你好2</h1>
      </div>
    `
}


export function template2() {
  return `
      <style>
        .div{
          color:green;
        }
      </style>
      <div class="div" key=1>
        <p>
          你好2
        </p>
      </div>
      <div class="div">
        <h1>
          你好
        </h1>
      </div>
  `
}

export function template3() {
  return ``
}