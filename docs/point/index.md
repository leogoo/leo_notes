### createPortal
> 渲染弹窗时，防止组件层级的影响可以将弹窗组件单独渲染在body上。

手动加一个弹窗，会有问题是切断了mobx的依赖，这个组件没有包在provider里
```js
export default function renderPopup(popup) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  renderClient(popup, container);

  let timeoutId;
  return function cleanupPopup() {
    if (timeoutId) {
      return;
    }
    timeoutId = setTimeout(() => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }, 0);
  };
}

function renderClient(content, root) {
  if (!process.env.BROWSER) {
    return; // 不支持服务器端渲染
  }
  // eslint-disable-next-line no-undef
  if (typeof USE_ISO_STYLE_LOADER !== 'undefined' && USE_ISO_STYLE_LOADER === true) {
    const StyleContext = require('isomorphic-style-loader/StyleContext');
    const insertCss = (...styles) => {
      const removeCss = styles.map(style => style._insertCss());
      return () => removeCss.forEach(dispose => dispose());
    };
    ReactDOM.render(<StyleContext.Provider value={{ insertCss }}>{content}</StyleContext.Provider>, root);
  } else {
    ReactDOM.render(content, root);
  }
}
```

应该直接使用createPortal
```js
const Component = React.createPortal(<Comp />, document.body);
```

### 字号单位问题
```js
function calcSizeToPixel(size: number | string): number {
    if (typeof size === 'number') {
        return size || 0;
    }
    if (typeof size === 'string') {
        return getPixelsOfOneRem() * Number(size || 0);
    }
}

/**
 * @description 计算1rem对应的px
 */
export function getPixelsOfOneRem() {
    // 取得html中设置的字体大小
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
}
```
