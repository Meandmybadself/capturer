import React, { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const App: React.FunctionComponent = () => {

    const [regex, setRegex] = useLocalStorage('regex', '([a-z]+)')
    const [corpus, setCorpus] = useLocalStorage('corpus', 'This is an example of a phone number: (415) 555-1212.  This is an UPPERCASED WORD.  This is a list of numbers, separated by commas: 1,12,44,16')
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
            <h1>C(aptu)re Capt(urer)</h1>
            <p>Return only the values found in regex capture groups.</p>
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
