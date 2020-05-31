const methods = ['GET', 'POST', 'PUT', 'DELETE'];

class Router {
  constructor() {
    this.routesMap = new Map();
    const rm = this.routesMap;

    methods.map(method => {
      rm.set(method, new Map());
    })
  }
  //路由注册函数
  register(method, pattern, handler) {
    let routes = this.routesMap.get(method);
    if (!routes) {
      throw new Error('该HTTP方法不被支持！');
    }
    routes.set(pattern, handler);
  }
  //路由处理函数，返回符合条件的处理函数
  matchHandle(method, url, ctx) {
    let routes = this.routesMap.get(method);

    if(!routes) {
      return null;
    }
    for (let [key, value] of routes) {
      let matchs;
      if (matchs = key.exec(url)) {
        ctx.params = matchs.slice(1);
        return value;
      }
    }
    return null;
  }
  //中间件函数
  middleware() {
    return async (ctx, next) => {
      const method = ctx.request.method;
      const url = ctx.request.url;
      const handler = this.matchHandle(method, url, ctx);
      if (handler) {
        await handler(ctx);
      } else {
        ctx.status = 404;
        ctx.body = '404 NOT FOUND!\n';
      }
      await next();
    }
  }
}

//给Router的上面几种方法添加了对应的函数，共添加了get,post,put及delete四种方法的函数
methods.map(method => {
  Router.prototype[method.toLocaleLowerCase()] = function(pattern, handler) {
    this.register(method, pattern, handler);
  }
})

module.exports = Router;
