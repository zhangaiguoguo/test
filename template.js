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
      <span>2</span>
      <div class=div key=2>
        <h1>你好2</h1>
      </div>
      <div class=div key=5>
        <h1>你好5</h1>
      </div>
      <div class=div key=3>
        <h1>你好3</h1>
      </div>
      <div class=div key=5>
        <h1>你好5</h1>
      </div>
      <div class=div key=4>
        <h1>你好4</h1>
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
      <span>1</span>
      <div class="div">
        <p>
          你好
        </p>
      </div>
      <span>3</span>
      <div class=div key=1>
        <h1>你好2</h1>
      </div>
      <span>2</span>
      <div class=div key=3>
        <h1>你好3</h1>
      </div>
      <span>4</span>
      <span>6</span>
      <div class=div key=5>
        <h1>你好5</h1>
      </div>
      <div class=div key=5>
        <h1>你好5</h1>
      </div>
      <div class=div key=4>
        <h1>你好4</h1>
      </div>
  `
}

export function template3() {
  return ``
}