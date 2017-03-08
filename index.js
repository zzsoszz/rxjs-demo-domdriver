
function main(DomSource)
{
  const $click=DomSource;
  return {
    Dom: $click.startWith(null).switchMap(x => Rx.Observable.timer(0, 1000).map(i => {
      return {
        tagName: 'div',
        children: [
          {
            tagName:"SPAN",
            children:[
              "Seconds "+i
            ]
          }
        ]
      }
    })),
    Log: Rx.Observable.timer(0, 2000).map(i => {
      return "second " + i;
    })
  };
}


function makeDomDriver(selector)
{
   function createElement(obj){
            const element = document.createElement(obj.tagName);
            obj.children
              .filter(c=> typeof c=='object')
              .map(createElement)
              .forEach(c=>element.appendChild(c))
            ;
            obj.children
               .filter(c=> typeof c=='string')
               .forEach(c=>element.innerHTML=c);
            return element;
  }
  function DomDriver(obj$) {
          obj$.subscribe(obj => {
            const container = document.querySelector(selector);
            container.innerHTML='';
            const ele = createElement(obj);
            container.appendChild(ele);
          });
          const DomSource = Rx.Observable.fromEvent(document, "click");
          // const DomSource={
          //   selectEvents:function(tagName,eventType)
          //   {
          //      return Rx.Observable.fromEvent(document,eventType).filter(ev=>ev.target.tagName===tagName.toUpperCase())
          //   }
          // };
          return DomSource;
  }
  return DomDriver;
}


function ConsoleLogDriver(msg$){
  msg$.subscribe(value => {
    console.log(value);
  });
}

function run(mainFn,dirvers)
{
  var proxyDomSource=new Rx.Subject();
  const sinks=mainFn(proxyDomSource);
  const DomSource=dirvers.Dom(sinks.Dom);
  DomSource.subscribe(click=>{
    proxyDomSource.onNext(click)
  });
}

var drivers={
  Dom:makeDomDriver("#app"),
  Log:ConsoleLogDriver
};
run(main,drivers);