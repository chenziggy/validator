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
      values: [null, null, 180],
      errorMsg: "请重新选择送审时间，受案时间距离报警时间",
    },
  ],
  '/jwzh-jcj/workflow/jqxxsp.html': [
    {
      operateType: "async",
      selectors: [ "#shsj"],
      values: [null, 1440],
        asyncOperate: {
        asyncFunc: async () => {
          const params = new URLSearchParams({
            asjbh,
          });
          const info = await fetch(
            `${pathConfig.basePath}/api/jcj/jq/queryDetailPagebyAsjbh?${params.toString()}`,
            {
              method: 'GET',
            })
            console.log(info)
            const {jqxx} = await info.json()
            console.log(jqxx.cjcljg)
            if (jqxx && jqxx.cjcljg &&(jqxx.cjcljg === '01' || jqxx.cjcljg === '02')) {
              const formData = new URLSearchParams();
              formData.append('jq_xxzjbh', xxzjbh);
              const res = await fetch(`${pathConfig.basePath}/jqLadj/queryByJq_xxzjbh`, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
              });
              const ret = await res.json()
              if (ret && ret.code === '200' && ret.rows && ret.rows.length) {
                return ret.rows[0].jbsj
              }
              return undefined;
            }
            return true;
        },
       
        operateType: "time<",
      },
      errorMsg: "审核时间距离报警时间超过一天"
    }
  ],
};


