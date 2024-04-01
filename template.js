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
      <span>4</span>
      <span>6</span>
      <div class=div key=1>
        <h1>你好2</h1>
      </div>
  `
}

export function template3() {
  return ``
}