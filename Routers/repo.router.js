// Requiring and Initializing Dependencies
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:user/:repo/', async (req, res) => {
    // Get user and repository values from URL
    const user = req.params.user;
    const repository = req.params.repo;
    let data = {};
    await axios.get(`https://api.github.com/repos/${user}/${repository}`)
    .then(async result => {
        data.name = result.data.name;
        data.description = result.data.description;
        data.size = result.data.size;
        data.language = result.data.language;
        data.stars = result.data.stargazers_count;
        data.forks = result.data.forks_count;
        data.watchers = result.data.subscribers_count;

        data.languages = [];
        axios.get(result.data.languages_url)
        .then(languages => data.languages = languages.data )
        .catch(err => console.log(err))
        
        data.closedIssues = 0;
        await axios.get(`https://api.github.com/search/issues?q=repo:${user}/${repository}+type:issue`)
        .then(totalIssues => data.totalIssues = totalIssues.data.total_count)
        .catch(err => console.log(err))

        await axios.get(`https://api.github.com/search/issues?q=repo:${user}/${repository}+type:issue+state:closed`)
        .then(closedIssues => data.closedIssues = closedIssues.data.total_count)
        .catch(err => console.log(err))

        data.openIssues = data.totalIssues - data.closedIssues
        await axios.get(`https://api.github.com/search/issues?q=repo:${user}/${repository}+type:pr`)
        .then(totalPR => data.totalPulls = totalPR.data.total_count)
        .catch(err => console.log(err))

        await axios.get(`https://api.github.com/search/issues?q=repo:${user}/${repository}+type:pr+state:closed`)
        .then(closedPR => data.closedPulls = closedPR.data.total_count)
        .catch(err => console.log(err))

        data.openPulls = data.totalPulls - data.closedPulls
        res.json(data)
    })
    .catch(err => res.status(err.response.status).json(err.response.statusText))
})

router.get('/issues/:user/:repo', async(req, res) => {
    const user = req.params.user;
    const repository = req.params.repo;

    await axios.get(`http://localhost:5000/repo/${user}/${repository}/`)
    .then(data => {
        let color;
        const issues = data.data.openIssues;
        if(issues > 0) color = '#dfb317';
        else color = '#4c1';
        res.set('Content-Type', 'text/xml');
        res.send(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="90" height="20" role="img" aria-label="issues: 0 open">
        <title>issues: 0 open</title>
        <linearGradient id="s" x2="0" y2="100%">
            <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
            <stop offset="1" stop-opacity=".1"/>
        </linearGradient>
        <clipPath id="r">
            <rect width="90" height="20" rx="3" fill="#fff"/>
        </clipPath>
        <g clip-path="url(#r)">
            <rect width="43" height="20" fill="#555"/>
            <rect x="43" width="47" height="20" fill="${color}"/>
            <rect width="90" height="20" fill="url(#s)"/>
        </g>
        <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
            <text aria-hidden="true" x="225" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="330">issues</text>
            <text x="225" y="140" transform="scale(.1)" fill="#fff" textLength="330">issues</text>
            <text aria-hidden="true" x="655" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="370">${issues} open</text>
            <text x="655" y="140" transform="scale(.1)" fill="#fff" textLength="370">${issues} open</text>
        </g>
    </svg>`)
    })
    .catch(err => console.log(err))
    
})

router.get('/:user/:repo/:options', async (req,res) => {
    const optionList = ['star', 'stargazers_count', 'license', 'spdx_id', 'fork', 'forks', 'lang', 'language', 'watch', 'size', 'issue', 'subscriptions', 'latest_version'];
    const user = req.params.user;
    const repo = req.params.repo;
    const options = req.params.options;
    for (let i = 0; i < optionList.length; i++){
        if(options === optionList[i]){
            const opts = optionList[i+1];
        }
    }
})

module.exports = router;