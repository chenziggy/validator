import { Message } from './message'
import { modules } from './modules'
import {operate } from './operate'
import { formatErrorMsg, handleSelectorsValues } from './utils'

const message = new Message();

const link = document.createElement("link")
link.rel= "stylesheet"
link.href = `${staticPath}/stylesheets/message.css`
document.head.appendChild(link)




let callback = (operateType, values, asyncOperate) => {
  console.log(
    `${JSON.stringify(
      asyncOperate.ret ? [asyncOperate.ret, ...values] : values
    )} validator "${
      asyncOperate.operateType
        ? `${operateType} ${asyncOperate.operateType}`
        : `${operateType}`
    }"  success  `
  );
};



async function validator({
  operateType,
  values = [],
  errorMsg = "",
  successMsg = "",
  success = callback,
  asyncOperate = {},
}) {
  const validate = operate[operateType];

  try {
    async function operateStrategy() {
      switch (operateType) {
        case "async":
          const {
            asyncFunc,
            params,
            operateType: subOperateType,
          } = asyncOperate;
          return await validate(
            asyncFunc,
            params,
            subOperateType,
            asyncOperate,
            values
          );
        default:
          return validate(...values);
      }
    }
    const valid = await operateStrategy();
    if (valid.res === true) {
      successMsg
        ? console.log(successMsg)
        : success(operateType, values, asyncOperate);
    } else {
      throw valid;
    }
  } catch (error) {
    
    message.setOption({
      message: 
      error.data ?
        formatErrorMsg({operateType, errorMsg, data: error.data})
        : errorMsg
    })
  }
}

const asyncQuery = (params) => {
  return Promise.resolve(params);
};


function observe(obj, property, cb) {
  const __proto__ = Object.getPrototypeOf(obj);
  if (__proto__.hasOwnProperty(property)) {
    let descriptor = Object.getOwnPropertyDescriptor(__proto__, property);
    Object.defineProperty(obj, property, {
      get: function () {
        return descriptor.get.apply(this);
      },
      set: function () {
        descriptor.set.apply(this, arguments);
        if (typeof cb == "function") {
          cb(this[property])
        }
      }
    });
  }
}
function handleModulesValidator() {
  const url = window.location.href;

  const matchKeys = Object.keys(modules).filter((key) => url.includes(key));
  const matchModules = matchKeys.map((key) => modules[key]);
  if (matchModules.length) {
    matchModules.forEach((item) => {
      item.forEach((opera) => {
        if (opera.selectors && opera.selectors.length) {
          // 规则dom节点对象
          const nodeList = opera.selectors.map((selector) =>
            document.querySelector(selector)
          );
          
          for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i]) {
              observe(nodeList[i], "value", () => {
                const values = handleSelectorsValues({
                  values: opera.values,
                  nodeList,
                });
                validator({
                  operateType: opera.operateType,
                  values,
                  errorMsg: opera.errorMsg,
                  successMsg: opera.successMsg,
                  asyncOperate: Object.assign({}, opera.asyncOperate, {
                    asyncFunc: asyncQuery,
                  }),
                })
              })
            }
          }
        }
      });
    });
  }
}

setTimeout(() => {
  handleModulesValidator()
}
, 4000)
