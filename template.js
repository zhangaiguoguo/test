export function template() {
    return `

    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        body {}
    
        /* /* style*/
      </style>
    </head>
    
    <body class="body">
      <!-- 
          div
    
        -->
    </body>
    <script src="./index.js"></script>
    <script src="./parseTag.js"></script>
    <script src="./pinia.js">
    </script>
    <script>
    
      // console.log(hooks);
      // console.log(pinia)
      // pinia.installReactiveHooks(hooks)
      // pinia.createPinia()
      // const stateStore = pinia.defineStore('state',{
      //   state(){
      //     return {
      //       num:1
      //     }
      //   },
      //   getters:{
    
      //   },
      //   actions:{
    
      //   }
      // })
    
      '<\\/script>'
    
      // console.log(stateStore);
    
      //<\\/script>
    
      /**
       *
       * @param item <\\/script>
       * @param list
       * @param index
       * @param info
       */
    </script>
    <script type="module">
      import { template } from "./template.js"
      import { baseParse } from "./parseTemplate.js"
      const startDate = Date.now()
      try {
        console.log(baseParse(template()));
        console.log(Date.now() - startDate);
      } catch (err) {
        console.warn(err)
      }
    
    
    </script>
    
    </html>


    `
}