import React from 'react'
const style = require("raw-loader!./courseapp.txt")
const style2 = require("raw-loader!./style2.txt")
const resume = require("raw-loader!./resume.txt")
import showdown from 'showdown'
import Prism from 'prismjs'
let interval = 40
let node = 'wholeWrap'

const wirteChars = (that, char) => new Promise((resolve) => {
    const origin = that.state.realStyleText + char
    const originResume = that.state.resumeText + char

    const converter = new showdown.Converter();
    const markdownResume = converter.makeHtml(originResume);

    const html = Prism.highlight(origin, Prism.languages.css)

    setTimeout(() => {
        if (node == 'wholeWrap') {
            that.setState({
                styleText: html,
                realStyleText: origin
            })
            that.contentNode.scrollTop = that.contentNode.scrollHeight
        } else if (node == 'resume') {
            that.setState({
                resumeText: originResume,
                DOMResumeText: markdownResume
            })
            that.resumeNode.scrollTop = that.resumeNode.scrollHeight
        }

        if (char == "？" || char == "，" || char == '！') {
            interval = 700
        } else {
            interval = 25
        }
        resolve()
    }, interval)
})

const writeTo = async (that, nodeName, index, text) => {
    node = nodeName
    let char = text.slice(index, index + 1)
    index += 1
    if (index > text.length) {
        return
    }
    await wirteChars(that, char)
    await writeTo(that, nodeName, index, text)
}


export default class Content extends React.Component {
    constructor(...prop) {
        super(...prop)
        this.state = {
            styleText: ``,
            realStyleText: ``,
            resumeText: ``
        }
    }
    componentDidMount() {
        (async (that) => {
            await writeTo(that, 'wholeWrap', 0, style)
            await writeTo(that, 'resume', 0, resume)
            await writeTo(that, 'wholeWrap', 0, style2)
        })(this)
    }
    render() {
        return (
            <div>
                <div
                    className='wholeWrap'
                    ref={node => this.contentNode = node}
                    style={{
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        outline: 0
                    }}
                >
                    <div dangerouslySetInnerHTML={{ __html: this.state.styleText }}></div>
                    <style dangerouslySetInnerHTML={{ __html: this.state.realStyleText }}></style>
                </div>
                <div
                    className='resume'
                    ref={node => this.resumeNode = node}
                    style={{
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        outline: 0
                    }}

                    dangerouslySetInnerHTML={{ __html: this.state.DOMResumeText }}></div>
            </div>
        )
    }
}

