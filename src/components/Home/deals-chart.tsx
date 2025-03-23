import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";
import { DASHBOARD_DEALS_CHART_QUERY } from "../../graphql/queries";
import { useList } from "@refinedev/core";
import { mapDealsData } from "../../utilities/helpers";
import React from "react";

const DealsChart = () => {
  const {data} = useList({
    resource: 'dealStages',
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY
    }
  })

  const dealData = React.useMemo(() => {
    return mapDealsData(data?.data)
  }, [data?.data])

  const config: AreaConfig = {
    data: dealData,
    xField: 'timeText',
    yField: 'value'
  }

  //* testing console log
  console.log(data)
  

  
  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "24px 24px 0 24px" },
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Deals
          </Text>
        </div>
      }
    >
      <Area {...config} height={325}/>
    </Card>
  );
};

export default DealsChart;
