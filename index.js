
function main(DomSource)
{
  const $click=DomSource;
  return {
    Dom:$click.switchMap(x=>Rx.Observable.timer(0,1000).map(i =>{return "second "+i;})),
    Log:Rx.Observable.timer(0,2000).map(i =>{return "second "+i;})
  };
}
function DomDriver(text$)
{
  text$.subscribe(value => {
      const container=document.querySelector("#app");
      container.textContent=value;
  });
  const DomSource=Rx.Observable.fromEvent(document,"click");
  return DomSource;
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
  Dom:DomDriver,
  Log:ConsoleLogDriver
};
run(main,drivers);