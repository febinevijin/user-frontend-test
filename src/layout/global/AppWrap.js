import React from 'react'
import classNames from "classnames"
import bg2 from "../../../src/images/bg2.png";

function AppWrap({className,...props}) {
  const compClass = classNames({
    "nk-wrap": true,
    'glassbg':true,
    [`${className}`]: className,
  });
  return (
    <div className={compClass}>
        {props.children}
    </div>
  )
}

export default AppWrap