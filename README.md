
# vite-plugin-pages-defname

定义组件名称, 便于 vue-route + keep-alive 动态更新

灵感来源于 vite-plugin-pages 和 vite-plugin-vue-definename


## 安装

```bash
npm install vite-plugin-pages-defname -D
```

## 配置项

```js
import { defineConfig } from "vite";
import defname from "vite-plugin-pages-defname";

export default defineConfig({
  plugins: [defname()],
});
```

## 使用

Script:
```js
<script setup>
defname("组件名");
</script>
```

YAML:
```html
<route lang="yaml">
defname: 组件名
</route>
```

或

```html
<route lang="yaml">
name: 组件名
</route>
```

> 命名方式优先级 `Script defname` > `YAML defname` > `YAML name`


