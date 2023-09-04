export const modules = {
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


