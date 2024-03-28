export function template() {
  return `
      <!-- <button class="a" click="onSwitch()">{{isOpen ? '关' : '开'}}</button> -->
      <button class="a" click="onSwitch()">{{isOpen ? '关' : '开'}}</button>
      <p>你好22</p>
      <div class="root-div" a b c>
        <!-- 你好 -->
        </div>
        <p>你好1</p>
        <input class="root-input" value="input value"/>
        <button class="root-btn">点击</button>
        <div>
          你好2 -> div
        </div>
      <div>111</div>
      <button class="a" b  click="onSwitch()">{{isOpen ? '关' : '开'}}</button>
    `
}


export function template2() {
  return `
        <div class="root-div" a b a1 c>
        </div>
        <!-- 你好 -->
        <p>你好</p>
        <div>
          <p>你好</p>
        </div>
        <input class="root-input" value="input value"/>
        <div>
          你好 -> div
        </div>
      <p>你好</p>
     <!-- <button class="a" click="onSwitch()">{{isOpen ? '关222' : '开'}}</button> -->
     <button class="a" b click="onSwitch()">{{isOpen ? '关' : '开'}}</button>
     <button class="a" click="onSwitch()">{{isOpen ? '关' : '开'}}</button>
     你好
  `
}

export function template3() {
  return ``
}