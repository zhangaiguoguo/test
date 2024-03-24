export function template() {
  return `

      <div class="root-div" a b c>
        <!-- 你好 -->
        <p>你好</p>
        <input class="root-input" value="input value"/>
        <button class="root-btn">点击</button>
        <div>
          你好 -> div
        </div>
        <style>
          .root-div{
            line-height:2;
          }
        </style>
        <script>

          const num = hooks.ref(1)
          
          hooks.watch(num,(v)=>{
            $("input.root-input").val(v)
          })

          $("input.root-input").on('input',({target})=>{
            num.value = target.value
          })

          $('button.root-btn').click(({target})=>{
            num.value +=1
            console.log("<\\/script>")
          })
          
          //<\\/script>

          /*
          
            <//script>

          */

        </script>
      </div>

    `
}


export function template2() {
  return `

        <div class="root-div" a b a1 c>
        <!-- 你好 -->
        <p>你好</p>
        <div>
          <p>你好</p>
        </div>
        <input class="root-input" value="input value"/>
        <div>
          <button a class="root-btn">点击</button>
          你好 -> div
        </div>
        <style>
          .root-div{
            line-height:2;
          }
        </style>
        <script>

          const num = hooks.ref(1)
          
          hooks.watch(num,(v)=>{
            $("input.root-input").val(v)
          })

          $("input.root-input").on('input',({target})=>{
            num.value = target.value
          })

          $('button.root-btn').click(({target})=>{
            num.value +=1
            console.log("<\\/script>")
          })
          
          //<\\/script>

          /*
          
            <//script>

          */

        </script>
      </div>
  
  `
}