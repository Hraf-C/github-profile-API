var form = document.getElementById("form");
var loader = document.getElementById("lds-dual-ring");
var usernameInput = document.getElementById("ghusername");
var profileElement = document.getElementById("profile");
var reposElement = document.getElementById("repos");


// On Submit event
form.addEventListener('submit', function (e) {
    e.preventDefault();//prevent reloading page

    /*if (!usernameInput.value) {
        alert('Please Enter a valid Username');
        return ;
    }*/

    
    // Display loader
    loader.style.display = "block";
    profileElement.style.display = "none";
    reposElement.style.display = "none";


    // Define Github API URI
    var profileURI   = 'https://api.github.com/users/'+usernameInput.value;
    var repoURI  = 'https://api.github.com/users/'+usernameInput.value+'/repos';
    

    // 
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var profile = JSON.parse(this.responseText);

            if (this.status == 404 ) {
                alert('User Not Found');
                return ;
          }

            renderProfile(profile);

            var xmlhttpRepos = new XMLHttpRequest();

            xmlhttpRepos.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var repos = JSON.parse(this.responseText);
                    renderRepos(repos);
                    
                    reposElement.style.display = null;
                    profileElement.style.display = null;
                    loader.style.display = "none";

                    //console.log(repos);
                    

                }
            };

            xmlhttpRepos.open("GET", repoURI, true);
            xmlhttpRepos.send();
        }
    };
    xmlhttp.open("GET", profileURI, true);
    xmlhttp.send();
});


function renderProfile(profileData) {
    var template = `
        <div class="profile-img">
            <img src="` + profileData.avatar_url + `" alt="">
            <span class="circle"></span>
        </div>
        <div class="profile-name">
            <h3>` + profileData.name + ` <small><a href="` + profileData.html_url + `" target="_blank">@` + profileData.login + `</a></small></h3>
        </div>
        <div class="profile-meta">
            <span>Followers: ` + profileData.followers + `</span>
            <span>Following: ` + profileData.following + `</span>
            <span>Repos: ` + profileData.public_repos + `</span>
            <hr>
            <span><i class="fas fa-map-marker-alt"></i> ` + profileData.location + `</span>
            <span><i class="fa fa-globe-americas"></i> <a href="` + profileData.blog + `" target="_blank">` + profileData.blog + `</a></span>
        </div>
    `;
    profileElement.innerHTML = template;

}

function renderRepos(reposData) {
    var template = ``;


    for (var i = 0; i < reposData.length; i++) {
        var repo = reposData[i];
        var licenseNAme = (repo.license != null) ? repo.license.name : "No License";
        var date = new Date(repo.created_at);
        var readableDate = date.getFullYear()+'/'+(date.getMonth()+1)+'/'+(date.getDay()+1);
        template += `
            <div class="repo">
                <div class="repo-front">
                    <div class="repo-title"><h3>` + repo.name + `</h3></div>
                    <div class="repo-meta">
                        <span class="stars"><i class="fas fa-star"></i> Stars <span class="val">` + repo.stargazers_count + `</span></span>
                        <span class="forks"><i class="fas fa-code-branch"></i> Forks <span class="val">` + repo.forks_count + `</span></span>
                        <span class="created"><i class="fas fa-clock"></i> Created <span class="val">` + readableDate + `</span></span>
                        <span class="license"><i class="fas fa-id-badge"></i> License <span class="val">` + licenseNAme + `</span></span>
                    </div>
                </div>
                <div class="repo-back">
                    <a href="` + repo.html_url + `" target="_blank">Got to Repo <i class="fas fa-angle-right"></i></a>
                </div>
            </div>
            `;
    }


    reposElement.innerHTML = template;
}

