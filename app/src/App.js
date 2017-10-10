import React from '../Luy'
const style = require("raw-loader!./style1.txt") //注意使用raw-loader解析字符串
const style2 = require("raw-loader!./style2.txt")
const resume = require("raw-loader!./resume.txt")
import showdown from 'showdown' //第三方的一个开源markdown库
import Prism from 'prismjs'//第三方的一个开源的代码染色库，非常好用
let interval

import './preStyle.css' //就是预先放置的一个css

const wirteChars = (that, nodeName, char) => new Promise((resolve) => {
    setTimeout(() => {
        if (nodeName == 'workArea') {
            const origin = that.state.DOMStyleText + char
            const html = Prism.highlight(origin, Prism.languages.css)
            that.setState({
                styleText: html,
                DOMStyleText: origin
            })
            
            that.contentNode[0].scrollTop = that.contentNode[0].scrollHeight
        } else if (nodeName == 'resume') {
            const originResume = that.state.resumeText + char
            const converter = new showdown.Converter()
            const markdownResume = converter.makeHtml(originResume)
            that.setState({
                resumeText: originResume,
                DOMResumeText: markdownResume
            })
            that.resumeNode[0].scrollTop = that.resumeNode[0].scrollHeight
        }
        /* 这里是控制，当遇到中文符号的？，！的时候就延长时间  */
        if (char == "？" || char == "，" || char == '！') {
            interval = 800
        } else {
            interval = 22
        }
        resolve()//一定要写的promise函数，不然你无法获得promise结果
    }, interval)
})

const writeTo = async (that, nodeName, index, text) => {
    /* 一个字一个字的读咯,这样会获得丝滑柔顺的打字效果... */
    let speed = 1
    let char = text.slice(index, index + speed)
    index += speed
    if (index > text.length) {
        return//如果字打完了，就返回了
    }
    await wirteChars(that, nodeName, char)
    await writeTo(that, nodeName, index, text)
}

export default class Content extends React.Component {
    constructor(...prop) {
        super(...prop)
        this.state = {
            styleText: ``,
            DOMStyleText: ``,
            resumeText: ``,
            DOMResumeText: ``
        }
        this.contentNode = document.getElementsByClassName('workArea')
        this.resumeNode = document.getElementsByClassName('resume')
    }
    componentDidMount() {
        
        (async (that) => {//这里的这个函数中文名叫做「定义即运行函数」，其实就是定义了马上运行。
            await writeTo(that, 'workArea', 0, style)
            await writeTo(that, 'resume', 0, resume)
            await writeTo(that, 'workArea', 0, style2)
        })(this)
    }
    render() {
        return (
            <div>
                <div
                    className='workArea'
                >
                    <div dangerouslySetInnerHTML={{ __html: this.state.styleText }}></div>
                    <style dangerouslySetInnerHTML={{ __html: this.state.DOMStyleText }}></style>
                </div>
                <div
                    className='resume'
                    dangerouslySetInnerHTML={{ __html: this.state.DOMResumeText }}>
                </div>
                <div id="bot" style={{padding:'10px',textAlign:'center',marginTop:'100px',fontSize:'10px',color:'rgba(150, 150, 150, 0.8)'}}>
                    Powered by
                    <a href="https://www.zhihu.com/people/fang-zheng-3-34/activities">知乎，方正</a>
                </div>
            </div>
        )
    }
}

