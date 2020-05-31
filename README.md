### koa-router-mini
Router middleware for koa.This is a learning project and I am constantly improving it.
### Usage
```javascript
import Koa from 'koa';
import Router from './src/Router';

const router = new Router();
const app = new Koa();

router.post(/^\/api/, controller);

app.use(router.middleware());
```
