import {utils } from './utils'

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