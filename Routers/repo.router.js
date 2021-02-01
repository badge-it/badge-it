// Requiring and initializing dependencies.
const express = require('express');
const router = express.Router();
const Axios = require('axios');

router.get('/:user/:repo/', async (req, res) => {
    const user = req.params.user;
    const repository = req.params.repo;
    let data = {}
    await Axios.get(`https://api.github.com/repos/${user}/${repository}`)
    .then(result => {
        data.name = result.data.name;
        data.description = result.data.description;
        data.size = result.data.size;
        data.language = result.data.language;
        data.languages = [];
        Axios.get(result.data.languages_url)
        .then(languages => {
            data.languages = languages.data;
        })
        .catch(err => console.log(err))
        data.stars = result.data.stargazers_count;
        data.forks = result.data.forks_count;
        data.openIssues = result.data.open_issues_count;
        data.watchers = result.data.subscribers_count;
        data.closedIssues = 0;
        await Axios.get(`https://api.github.com/search/issue?q=repo:${user}/${repo}+type:issue+state:closed`)
        .then(closedIssues => data.closedIssues = closedIssues.data.total_count)
        .catch(err => console.log(err))
        await Axios.get(`https://api.github.com/search/issues?q=repo:${user}/${repo}+type:pr`)
        .then(totalPR => data.totalPulls = totalPR.data.total_count)
        .catch(err => console.log(err))
        await Axios.get(`https://api.github.com/search/issues?q=repo:${user}/${repo}+type:pr+state:closed`)
        .then(closedPR => data.closedPulls = closedPR.data.total_count)
        .catch(err => console.log(err))
        res.json(data)
    })
    .catch(err => result.status(err.response.status).json(err.response.statusText))
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