const modules = {
  "/jwzh-jcj/jcj/jq/detailPage.html": [
    {
      operateType: "time<",
      selectors: ["#bjsj_rqsj", null],
      values: [null, null, 60],
      errorMsg: "报警时间",
    },
    {
      operateType: "jqlb",
      selectors: ["#jqlbdm", "#cjcljg"],
      errorMsg: "警情类别与处理结果不一致",
    },
  ],
  "/jwzh-jcj/jcj/table/sa_register.html": [
    {
      operateType: "time<",
      selectors: ["#enter_receive_time","#sablsj"],
      values: [null, null, 1440],
      errorMsg: "受案时间距离报警时间",
    },
  ]
};


const link = document.createElement("link")
link.rel= "stylesheet"
link.href = `${staticPath}/stylesheets/message.css`
document.head.appendChild(link)



class Message {
  constructor() {
    // 消息队列
    this.messageQueue = [];
    // 设置默认值
    this.position = 'top';
    this.message = '';
    this.type = '';
    this.duration = 5000;
    this.body = document.getElementsByTagName('body')[0];
    this.id = 0;
  }

  setType(messageDom, type) {
    if (type === '') {
      messageDom.classList.add('ui-message-info');
    } else if (type === 'success') {
      messageDom.classList.add('ui-message-success');
    } else if (type === 'warning') {
      messageDom.classList.add('ui-message-warning');
    } else if (type === 'error') {
      messageDom.classList.add('ui-message-error');
    } else {
      messageDom.classList.add('ui-message-info');// 默认值
    }
  }

  createTextDom(messageDom, message) {
    const p = document.createElement('p');
    p.classList.add('message-content');
    p.textContent = message || this.message;
    messageDom.appendChild(p);
  }

  removeMessageDom(messageDom, targetId) {
    const startIndex = this.messageQueue.findIndex(message => message.id === targetId);
    this.messageQueue.splice(startIndex, 1);
    this.updateMessageDom(startIndex);
    //增加移除动画
    messageDom.classList.add('ui-message-leave');
    setTimeout(() => {
      this.body.removeChild(messageDom);
    }, 400);
  }

  setOption(options) {
    if (typeof options !== "object") {
      options = {};
    }
    const messageDom = document.createElement('div');
    messageDom.classList.add('ui-message');
    messageDom.classList.add('ui-message-leave');
    if (options.center === true) {
      messageDom.classList.add('ui-message-center');
    }
    const targetId = this.id;
    this.messageQueue.push({
      id: targetId,
      messageDom,
    });
    this.setType(messageDom, options.type);
    this.createTextDom(messageDom, options.message);
    this.setCurrentMessageDom();
    this.body.appendChild(messageDom);
    //增加新增动画
    setTimeout(() => {
      messageDom.classList.remove('ui-message-leave');
    }, 100);
    let i = null;
    if (options.showClose === true) {
      i = document.createElement('i');
      i.classList.add('close-button');
      messageDom.appendChild(i);
    }
    const time = isNaN(Number(options.duration)) ? this.duration : Number(options.duration);
    // 如果duration为0则不需要setTimeout
    let timeId = -1;
    if (time !== 0) {
      timeId = setTimeout(() => {
        this.removeMessageDom(messageDom, targetId);
      }, time);
    }
    if (options.showClose === true) {
      i.addEventListener('click', () => {
        this.removeMessageDom(messageDom, targetId);
        if (targetId !== -1) {
          clearTimeout(timeId);
        }
      });
    }
    this.id++;
  }

  setCurrentMessageDom() {
    const index = this.messageQueue.length - 1;
    const targetDom = this.messageQueue[index].messageDom;
    targetDom.style.zIndex = `${2000 + index}`;
    targetDom.style.top = `${64 * index + 20}px`;
  }

  updateMessageDom(startIndex) {
    for (let i = startIndex; i < this.messageQueue.length; i++) {
      const messageDom = this.messageQueue[i].messageDom;
      messageDom.style.zIndex = `${2000 + i}`;
      // 暂不支持换行功能，换行后获取上一个元素的height和top来更新下一个元素的top
      messageDom.style.top = `${64 * i + 20}px`;
    }
  }
}


const message = new Message();


const utils = {
  isNumber: () => {
    const flag = Array.from(arguments).every(
      (item) => typeof item === "number" && !isNaN(item)
    );
    if (!flag) {
      throw TypeError(`The val is not a number`);
    }
  },
  formatTime
};

const equal = (...rest) => {
  return {res: new Set(rest).size === 1};
};

const isLessThan = function (val, max) {
  utils.isNumber(arguments);
  return {res: val < max};
};

const isGreatThan = function (val, min) {
  utils.isNumber(arguments);
  return { res: val > min };
};

const startsWith = function (str, subStr) {
  return { res: str.startsWith(subStr) };
};

const jqlb = function (str, subStr) {
  if (subStr === '01' || subStr === '02'|| str.startsWith('01') || str.startsWith('02')) {
    return startsWith(str, subStr)
  }
  return {res: true}
}

const inRange = function (val, min, max) {
  utils.isNumber(arguments);
  return { res: val >= min && val <= max};
};

const lessThanNMinutes = (time1, time2, n) => {
  const minutes = n * 1000 * 60;
  const date1 = new Date(time1);
  const date2 = new Date(time2 ? time2 : Date.now());
  const diff = date2 - date1;
  if (diff >= 0) {
    return { res: diff < minutes, data: diff};
  }
  return {res: false, data: diff};
};

const greatThanNMinutes = (time1, time2, n) => {
  const minutes = n * 1000 * 60;
  const date1 = new Date(time1);
  const date2 = new Date(time2 ? time2 : Date.now());
  const diff = date1 - date2;
  if (diff >= 0) {
    return {res: diff > minutes, data: diff};
  }
  return {res: false, data: diff};
};

const asyncOperateHandler = async (
  asyncFunc,
  params,
  subOperateType,
  asyncOperate,
  values
) => {
  const res = await asyncFunc(params);
  asyncOperate.ret = res;
  return operate[subOperateType](res, ...values);
};

const operate = {
  "===": equal,
  "<": isLessThan,
  ">": isGreatThan,
  inRange,
  "time<": lessThanNMinutes,
  "time>": greatThanNMinutes,
  startsWith,
  jqlb,
  async: asyncOperateHandler,
};

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

function formatErrorMsg({operateType, errorMsg ,data}) {
  switch (operateType) {
    case 'time<':
      const msgList = errorMsg.split('距离')
      const flag = msgList.length > 1 
      return `${flag? msgList[0] : errorMsg }距离${ flag ? msgList[1] : '当前时刻'}已过去${utils.formatTime(data)}`
  }
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const remainingSeconds = ((seconds % 86400) % 3600) % 60;

  const formattedDays = String(days).padStart(2, '0');
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedDays}天${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

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


function handleSelectorsValues({ operateType, values, nodeList }) {
  const nodeListValue = nodeList.map((node) => node && node.value);
  if (!values) return nodeListValue;
  const results = values.slice();
  for (let i = 0; i < results.length; i++) {
    if (!results[i]) {
      results[i] = nodeListValue[i];
    }
  }
  return results;
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
                  operateType: opera.operateType,
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


window.handleModulesValidator;

setTimeout(() => {
  handleModulesValidator()
}
, 4000)