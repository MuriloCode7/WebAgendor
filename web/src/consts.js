const consts =
  process.env.ENVIRONMENT === "online"
    ? {
        companyId: "65242a3c69e74cdf01e6ee77",
        customerId: "6529748fc77e296401bdc64c",
      }
    : {
        companyId: "65370e6505053c1ffe0c8756",
        customerId: "6529748fc77e296401bdc64c",
      };

export default consts;
