import { renderActiveShape } from "../../utilFunctions/rechartutils.jsx";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, Sector, Label } from "recharts";
import { useState } from "react";

import "../../styles/moreposts-screen-styles/feelingcategorychart.css";

export function FeelingCategoryChart({feelingCategoriesCount}) {
    const [ isAnimationActive, setIsAnimationActive ] = useState();

    return (
        <div className="feeling-category-chart">
            <h2>Reaction categories</h2>
            <ResponsiveContainer
                width="400"
                height="330"
            >
                <PieChart
                    margin={{
                        top: 40,
                        left: 30,
                        right: 30,
                        bottom: 20
                    }}
                    barGap={30}
                >
                    <Pie
                        data={feelingCategoriesCount}
                        innerRadius="60%"
                        outerRadius="80%"
                        dataKey="count"
                        nameKey="category"
                        isAnimationActive={isAnimationActive}
                        activeShape={renderActiveShape}
                        label={!isAnimationActive}
                        onMouseEnter={() => setIsAnimationActive(true)}
                        onMouseLeave={() => setIsAnimationActive(false)}
                    >
                        {feelingCategoriesCount && feelingCategoriesCount.map((slice, index) => {
                        return (<Cell
                            key={`cell-${index}`}
                            fill={slice["color"]} 
                        />)})}
                    </Pie>
                    <Legend
                        layout="horizontal"
                        align="left"
                        iconType="circle"
                        iconSize={7}
                        wrapperStyle={{fontSize:15, fill: "black", height: 100, width: "70%", paddingTop: 30, fontFamily: "Poppins"}}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>

    )
};