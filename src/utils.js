export const utils = {
  isNumber: (...res) => {
    const flag = Array.from(res).every(
      (item) => typeof item === "number" && !isNaN(item)
    );
    if (!flag) {
      throw TypeError(`The val is not a number`);
    }
  },
  formatTime
};


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

export function formatErrorMsg({operateType, errorMsg ,data}) {
  switch (operateType) {
    case 'time<':
      const msgList = errorMsg.split('距离')
      const flag = msgList.length > 1 
      return `${flag? msgList[0] : errorMsg }距离${ flag ? msgList[1] : '当前时刻'}已过去${utils.formatTime(data)}`
  }
}


export function handleSelectorsValues({ values, nodeList }) {
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