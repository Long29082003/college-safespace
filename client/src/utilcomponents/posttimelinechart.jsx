import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

import "../styles/posttimelinechart.css";

export const PostTimelineChart = () => {

    return (
        <div className="post-timeline-chart">
            <h2>Post action</h2>
            <ResponsiveContainer
                width={450}
            >
                <BarChart
                >

                </BarChart>
            </ResponsiveContainer>
        </div>
    )
};