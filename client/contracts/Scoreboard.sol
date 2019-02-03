pragma solidity >=0.4.22 <0.6.0;

contract Scoreboard{

    struct Candidate{
        uint id;
        string name;
        uint score;
    }
    mapping (uint => Candidate) public candidates;
    uint public candidatecount;
    address public voter;

    event eventVote(
        uint indexed _candidateid
    );

    constructor () public {
        addCandidate("Alice");
        addCandidate("Bob");
        voter = msg.sender;
    }

    function addCandidate(string memory _name) private {
        candidatecount++;
        candidates[candidatecount] = Candidate(candidatecount,_name,0);
    }
    
    function removeCandidate(uint _candidateid) public {
        candidatecount--;
        delete(candidates[_candidateid]);
        
        emit eventVote(_candidateid);
    }

    function scoreUp(uint _candidateid) public {
        
        assert(_candidateid >= 0 && _candidateid <= candidatecount);

        candidates[_candidateid].score ++;

        emit eventVote(_candidateid);

    }
    
    function scoreDown(uint _candidateid) public {
        
        assert(_candidateid >= 0 && _candidateid <= candidatecount);
        
        candidates[_candidateid].score--;

        emit eventVote(_candidateid);

    }
    
    

}