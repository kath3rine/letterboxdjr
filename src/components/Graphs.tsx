import { Area, AreaChart, Bar, BarChart, Pie, PieChart,
    XAxis, YAxis, Tooltip, Cell, Legend} from 'recharts'

type AreaProps = {
    title?: string
    data: any
    palette: string[]
    w: number
    h: number
    color: number
    domain?: number
}

export function AreaGraph(props: AreaProps) {
    const myDomain = [0, props.domain]
    return(
        <div>
            <h3>{props.title}</h3>
            <AreaChart width={props.w} height={props.h} data={props.data}>
                <Tooltip/>
                <XAxis dataKey="name" />
                <YAxis interval={0}/>
                <Area dataKey="value"
                type="monotone"
                stroke={props.palette[props.color]} 
                fill={props.palette[props.color]}/>
            </AreaChart>
        </div>
    )
}

type BarProps = {
    title?: string
    data: any
    domain?: number
    w: number
    h: number
    palette: string[]
    color?: number
}

export function BarGraph(props: BarProps) {
    const myDomain: any = [0, props.domain]

    return(
        <div>
            <h3>{props.title}</h3>
            <BarChart width={props.w} height={props.h} data={props.data}>
                <Tooltip/>
                <XAxis dataKey="name" type="category"/>
                <YAxis domain={myDomain}/>
                
                <Bar dataKey="value" >
                    {props.data && props.data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} 
                        fill={props.color == 0 || props.color
                            ? props.palette[props.color] 
                            : props.palette[index % props.palette.length]} />
                    ))}
                </Bar>
            </BarChart>
        </div>
    )
}

type StackedBarProps = {
    title?: string
    data: any[]
    domain?: number
    w: number
    h: number
    palette: string[]
    categories: any[]
}

export function StackedBar(props: StackedBarProps) {
    return(
        <div>
            <h3>{props.title}</h3>
            <BarChart width={props.w} height={props.h} data={props.data}>
                <Tooltip/>
                <XAxis dataKey="name" type="category"/>
                <YAxis/>
                
                {Array.from({ length: props.categories.length }, (_, i) => i).map((x) => (
                    <Bar dataKey={props.categories[x]} 
                    stackId="a" 
                    fill={props.palette[x]} />
                ))}
            </BarChart>
        </div>
    )
}


type PieProps = {
    title?: string
    w: number
    h: number
    legend?: boolean
    data: any
    palette: string[]
}

export function PieGraph(props: PieProps) {
    const renderCustomizedLabel = ({ percent, name }: any) => {
        if (percent <= 0.05 && props.data.length > 7) { return null }
        return `${name}: ${(percent * 100).toFixed(0)}%`;
      };

    return(
        <div>
            <h3>{props.title}</h3>
            <PieChart height={props.h} width={props.w}>
                <Pie data={props.data} 
                cx="50%" cy="50%" 
                outerRadius={50} 
                dataKey={"value"} 
                label={renderCustomizedLabel} >
                    {props.data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={props.palette[index]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    )
}
export default PieGraph