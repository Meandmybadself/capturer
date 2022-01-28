import React, { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const App: React.FunctionComponent = () => {
    const [regex, setRegex] = useLocalStorage('regex', '')
    const [corpus, setCorpus] = useLocalStorage('corpus', '')
    const [output, setOutput] = useState<string>('')
    const [matchCount, setMatchCount] = useState<number>(0)

    useEffect(() => {
        if (regex && corpus) {
            let re
            try {
                re = new RegExp(regex, 'gm')
            } catch (e) {
                console.log('invalid regex')
            }

            let output = ""
            let matches: RegExpExecArray | null
            let matchCount = 0

            while (matches = re.exec(corpus)) {
                matches.shift()
                output += matches.join('\t') + '\n'
                matchCount++
            }

            setOutput(output)
            setMatchCount(matchCount)
        }

    }, [regex, corpus])

    return (<div id='app'>
        <header>
            <h1>Capture Capturer</h1>
            <p>Return only the values in capture groups.</p>
            <p>To use, input a regular expression with capture groups and provide input.</p>
        </header>
        <div id='regex'>
            <label>
                <span>Regular Expression</span>
                <input type='text' id='regexInput' name='regexInput' value={regex} onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setRegex(e.target.value)} />
            </label>
        </div>
        <div id='corpus'>
            <label>
                <span>Input Text</span>
                <textarea value={corpus} onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setCorpus(e.target.value)} />
            </label>
        </div>
        <div id='output'>
            <div id='matchCount'>{matchCount}</div>

            <label>
                <span>Matches</span>
                <textarea value={output} readOnly />
            </label>
        </div>
    </div>)
}

export default App
