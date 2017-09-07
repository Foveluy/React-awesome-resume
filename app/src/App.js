import React from 'react'
const style = require("raw-loader!./style1.txt")
const style2 = require("raw-loader!./style2.txt")
const resume = require("raw-loader!./resume.txt")
import showdown from 'showdown'
import Prism from 'prismjs'
let interval

import './preStyle.css'

const wirteChars = (that, nodeName, char) => new Promise((resolve) => {
    setTimeout(() => {
        if (nodeName == 'workArea') {
            const origin = that.state.DOMStyleText + char
            const html = Prism.highlight(origin, Prism.languages.css)
            that.setState({
                styleText: html,
                DOMStyleText: origin
            })
            that.contentNode.scrollTop = that.contentNode.scrollHeight
        } else if (nodeName == 'resume') {
            const originResume = that.state.resumeText + char
            const converter = new showdown.Converter()
            const markdownResume = converter.makeHtml(originResume)
            that.setState({
                resumeText: originResume,
                DOMResumeText: markdownResume
            })
            that.resumeNode.scrollTop = that.resumeNode.scrollHeight
        }

        if (char == "？" || char == "，" || char == '！') {
            interval = 800
        } else {
            interval = 22
        }
        resolve()
    }, interval)
})

const writeTo = async (that, nodeName, index, text) => {
    let char = text.slice(index, index + 1)
    index += 1
    if (index > text.length) {
        return
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
            DOMResumeText:``
        }
    }
    componentDidMount() {
        (async (that) => {
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
                    ref={node => this.contentNode = node}
                >
                    <div dangerouslySetInnerHTML={{ __html: this.state.styleText }}></div>
                    <style dangerouslySetInnerHTML={{ __html: this.state.DOMStyleText }}></style>
                </div>
                <div
                    className='resume'
                    ref={node => this.resumeNode = node}
                    dangerouslySetInnerHTML={{ __html: this.state.DOMResumeText }}></div>
            </div>
        )
    }
}

