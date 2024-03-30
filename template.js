export function template() {
  return `
      <div class="div" data-id="1" tag="div" b>
        第一个div
      </div>
      <div class="div" data-id="3" tag="div" b key="2">
        第三个div
      </div>
      <style>
        .div{
          color:red;
        }
      </style>
    `
}


export function template2() {
  return `
      <div class="div" data-id="1" tag="div" b>
        第一个div
      </div>
      <div class="div" data-id="2" tag="div" b key="2">
        第二个div
      </div>
      <div class="div" data-id="3" tag="div" b key="1">
        第三个div
      </div>
      <style>
        .div{
          color:red;
        }
      </style>
  `
}

export function template3() {
  return ``
}