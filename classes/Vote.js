module.exports = class Vote {
    constructor () {
        this.choices = []
        this.params = {
            multipleVote: 'false',
            anonymous: 'true'
        }
        this.state = 0
    }

    enableMultipleVote () {
        this.params.multipleVote = true
    }

    disableMultipleVote () {
        this.params.multipleVote = false
    }

    enableAnonymous () {
        this.params.anonymous = true
    }

    disableAnonymous () {
        this.params.anonymous = false
    }

    setChoices (choices) {

    }

    deleteChoices() {

    }

    vote (choice, voter) {
        this.vote.push({voter: voter, choice: choice})
    }

    getVoters () {
        let votersList = []
        this.vote.forEach((voter) => {
            votersList.push(voter)
        })
        return votersList
    }

    getResults () {

    }
}