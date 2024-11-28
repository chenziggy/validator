import { utils } from './utils'

const equal = (...arr) => {
  return {res: new Set(arr).size === 1};
};

const isLessThan = function (val, max) {
  utils.isNumber(val, max);
  return {res: val < max};
};

const isGreatThan = function (val, min) {
  utils.isNumber(val, min);
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
  utils.isNumber(val, min, max);
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
  console.log("🚀 ~ res:", res)
  if (res === true) {
    return {res: true}
  }
  asyncOperate.ret = res;
  return operate[subOperateType](res, ...values);
};

export const operate = {
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