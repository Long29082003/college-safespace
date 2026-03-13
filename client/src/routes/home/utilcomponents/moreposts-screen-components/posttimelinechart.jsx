import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

import "../../styles/moreposts-screen-styles/posttimelinechart.css";

export const PostTimelineChart = ({postCountForEachMonth}) => {
    
    return (
        <div className="post-timeline-chart">
            <h2>Post action</h2>
            <ResponsiveContainer
                width={600}
                height={400}
            >
                {postCountForEachMonth && <BarChart
                    data={postCountForEachMonth}
                    barCategoryGap="15%"
                >
                    <YAxis/>
                    <XAxis dataKey = "month" fontSize = {14} fontFamily = "Poppins" fontWeight={500}/>
                    <CartesianGrid strokeDasharray = "3 3"/>
                    <Tooltip/>
                    <Bar dataKey = "count" fill = "rgb(115, 4, 189)" />
                </BarChart>}
            </ResponsiveContainer>
        </div>
    )
};