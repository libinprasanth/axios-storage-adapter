react-content-editable
=====================

It's React component which support content editable div


## Install

```sh
npm install reactjs-content-editable
```

## Usage

```javascript
import React, { useState } from 'react';
import { ContentEditable } from "reactjs-content-editable";

function App() {
  const [html, setHtml] = useState("")
  return (
    <>
      <ContentEditable 
        html={html} 
        onChange={(value: string) => setHtml(value)} 
      />
    </>
  );
}

export default App;

```

## Available props
|prop|description|type|
|--|----|----|
|html|**required:** innerHTML of the editable element|String|
|disabled|use true to disable editing|Boolean|
|onChange|called whenever `innerHTML` changes|Function|
|className|there is no default className are given, you can add your own|String|
|style|style properties which support react style format, by default height is set to 200px|Object|
|innerRef|if you want to control the element, you can pass ref|LegacyRef<HTMLDivElement> | React.RefObject<HTMLDivElement>|

## Support
If you are facing any issue, please contact [via linkedin ( Libin Prasanth )](https://www.linkedin.com/in/libinprasanth/).

## Examples

Do you want to try **react-content-editable** before use ?

 * [Simple example](https://codesandbox.io/s/react-content-editable-k6zn5c)

## Donate!
Like my Work! [Donate](https://www.paypal.me/LibinPrasanth) 