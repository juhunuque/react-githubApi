var Profile = React.createClass({
    handleFormSubmit: function(username){
        this.setState({username: username}, function(){
            this.loadUserData();
            this.loadRepoData();
        });
    },
    getDefaultProps: function(){
        return{
            clientId:'your client id',
            clientSecret: 'your client secret',
            urls: {
                user: 'http://api.github.com/users'
            },
            perPage: 5
        }
    },
    getInitialState: function(){
        return{
            username: null,
            userData: [],
            repoData: []
        }
    },
    loadUserData: function(){
        $.ajax({
            url: this.props.urls.user+'/'+this.state.username+'?client_id='+this.props.clientId+
            '&client_secret='+this.props.clientSecret,
            dataType: 'json',
            cache: 'false',
            success: function(data){
                this.setState({userData: data});
            }.bind(this),
            error: function(xhr, status, err){
                this.setState({username: null});
                alert(err);
            }.bind(this)
        });
    },
    loadRepoData: function(){
        $.ajax({
            url: this.props.urls.user+'/'+this.state.username+'/repos?per_page='+this.props.perPage+'&client_id='+this.props.clientId+
            '&client_secret='+this.props.clientSecret+'&sort=created',
            dataType: 'json',
            cache: 'false',
            success: function(data){
                this.setState({repoData: data});
            }.bind(this),
            error: function(xhr, status, err){
                this.setState({username: null});
                alert(err);
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.loadUserData();
        this.loadRepoData();
    },
    render: function(){
        return(
            <div>
                <SearchForm onFormSubmit={this.handleFormSubmit}/>
                {this.state.username ? <UserInfo userData={this.state.userData}/> : null}
                {this.state.username ? <Repos repoData={this.state.repoData}/> : null}
            </div>
        )
    }
});

var UserInfo = React.createClass({
    render: function(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <img className="thumbnail" style={{width: "100%"}}
                             src={this.props.userData.avatar_url} />
                    </div>
                    <div className="col-md-8">
                        <h3>{this.props.userData.name}</h3>
                        <a className="btn btn-primary" target="_blank"
                           href={this.props.userData.html_url}>Visit Github Page</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                                        <span className="label label-primary">
                                            {this.props.userData.public_repos} Repos
                                        </span>
                                        <span className="label label-success">
                                            {this.props.userData.public_gists} Public Gists
                                        </span>
                                        <span className="label label-info">
                                            {this.props.userData.followers} Followers
                                        </span>
                                        <span className="label label-danger">
                                            {this.props.userData.following} Following
                                        </span>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        <ul className="list-group">
                            <li className="list-group-item">
                                <strong>Username: </strong> {this.props.userData.login}
                            </li>
                            <li className="list-group-item">
                                <strong>Location: </strong> {this.props.userData.location}
                            </li>
                            <li className="list-group-item">
                                <strong>Email: </strong> {this.props.userData.email}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
});

var Repos = React.createClass({
    render: function(){
        var repoNodes = this.props.repoData.map(function(repo, index){
            if (!repo.description){
                repo.description = 'No description';
            }
            return (
                <Repo name={repo.name} description={repo.description} url={repo.html_url} key={index} />
            );
        });
        return(
            <div>
                <h2 className="page-header">Latest Repos</h2>
                {repoNodes}
            </div>
        )
    }
});

var Repo = React.createClass({
    render: function(){
        return(
            <div className="repoItem">
                <h4><a target="_blank" href={this.props.url}>{this.props.name}</a></h4>
                <p>{this.props.description}</p>
            </div>
        )
    }
});

var SearchForm = React.createClass({
    submitForm:function(e){
        e.preventDefault();
        var username =  this.refs.username.value.trim();
        if(!username){
            alert('Please enter a valid User');
            return;
        }
        this.props.onFormSubmit(username);
        this.refs.username.value='';
    },
    render: function(){
        return(
            <form onSubmit={this.submitForm} className="form-inline">
                <div className="form-group">
                    <input type="text" ref="username" className="form-control searchInput"
                           placeholder="Enter Github Username" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
});


ReactDOM.render(<Profile /> , document.getElementById('github-profiles'));