import React, { useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import cn from 'classnames'
import { useDebounce } from './hooks/useDebounce'

function compute(computation, ...message) {
    const delegate = () => {
        onmessage = ({ data: { computation, message } }) => {
            const wrapper = (fn) => Function('return (' + fn.toString() + ')')();
            const result = wrapper(computation)(...message);
            postMessage(result);
        };
    }
    const functionBody = delegate.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
    return new Promise((resolve, reject) => {
        const worker = new Worker(URL.createObjectURL(
            new Blob([functionBody], { type: 'text/javascript' })
        ));
        worker.onmessage = ({ data }) => {
            resolve(data);
            worker.terminate();
        };
        worker.onerror = worker.onmessageerror = reject;
        worker.postMessage({ computation: computation.toString(), message });
        return worker;
    });
}

function getCaptureGroups({ regex, corpus }) {
    const re = new RegExp(regex, 'gm')

    let output = ""
    let matches
    let matchCount = 0

    while (matches = re.exec(corpus)) {
        matches.shift()
        output += matches.join('\t') + '\n'
        matchCount++
    }
    return ({ output, matchCount })
}

const App: React.FunctionComponent = () => {
    const [regex, setRegex] = useLocalStorage('regex', '([a-z]+)')
    const debouncedRegex = useDebounce(regex, 500)
    const [corpus, setCorpus] = useLocalStorage('corpus', 'This is an example of a phone number: (415) 555-1212.  This is an UPPERCASED WORD.  This is a list of numbers, separated by commas: 1,12,44,16')
    const debouncedCorpus = useDebounce(corpus, 500)
    const [output, setOutput] = useState<string>('')
    const [matchCount, setMatchCount] = useState<number>(0)
    const [regexClassname, setRegexClassname] = useState('')

    const computeRegex = useCallback(async () => {
        const data: any = await compute(getCaptureGroups, { regex: debouncedRegex, corpus: debouncedCorpus })
        setOutput(data.output)
        setMatchCount(data.matchCount)
    }, [debouncedRegex, debouncedCorpus])

    useEffect(() => {
        try {
            new RegExp(regex, 'gm')
            computeRegex()
            setRegexClassname('')
        } catch (e) {
            console.log('invalid regex')
            setRegexClassname('invalid')
        }
    }, [debouncedCorpus, debouncedRegex])

    return (<div id='app'>
        <header>
            <h1>C(aptu)re Capt(urer)</h1>
            <p>Return only the values found in regex capture groups.</p>
            <p>To use, input a regular expression with capture groups and provide input.</p>
        </header>
        <div id='regex'>
            <label>
                <span>Regular Expression</span>
                <input className={cn(regexClassname)} type='text' id='regexInput' name='regexInput' value={regex} onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setRegex(e.target.value)} />
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
