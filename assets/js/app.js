const cl = console.log;

const moviesCard = document.getElementById("moviesCard");
const movieTitleControl = document.getElementById("movieTitle");
const movieUrlControl = document.getElementById("movieUrl");
const DiscriptionControl = document.getElementById("Discription");
const moviesContainer=document.getElementById("moviesContainer")
const RatingUrlControl = document.getElementById("RatingUrl");
const submitBtn = document.getElementById("submitBtn");
const updatedBtn = document.getElementById("updatedBtn");
const loader = document.getElementById("loader");


const baseUrl = `https://post-crud-a459f-default-rtdb.asia-southeast1.firebasedatabase.app`

const postUrl=`${baseUrl}/movies.json`

const onDelete=(ele)=>{
    Swal.fire({
        title: "Are you sure moviesCard?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let detletId=ele.closest(".card").id
    let DeleteUrl=`${baseUrl}/movies/${detletId}.json`

    makeApicall("DELETE",DeleteUrl)
    .then((res)=>{
        document.getElementById(detletId).remove()
    })
    .catch((err)=>{
        cl(err)
    })
    .finally(()=>{
        loader.classList.add("d-none")
    })
          Swal.fire({
            title: "Movies successfully Deleted!",
            icon: "success",
            timer:2000
          });
        }
      });
    
}

const onEdit=(ele)=>{
    let editId= ele.closest(".card").id
    cl(editId)
    localStorage.setItem("editId",editId);
    let editUrl=`${baseUrl}/movies/${editId}.json`
    makeApicall("GET",editUrl)
    .then((res)=>{
        cl(res)
        movieTitleControl.value=res.movieTitle;
        movieUrlControl.value=res.movieUrl;
        DiscriptionControl.value=res.Discription;
        RatingUrlControl.value=res.RatingUrl
        submitBtn.classList.add("d-none");
        updatedBtn.classList.remove("d-none")
    })
    .catch((err)=>{
        cl(err)
    })
    .finally(()=>{
        loader.classList.add("d-none")
    })
}

const creatTemplating = (arr)=>{
    moviesContainer.innerHTML=arr.map(obj=>{
        return `
        <div class="card mt-4" id="${obj.id}">
                        <div class="card-header">
                            <h5 class="m-0 d-flex justify-content-between">
                                ${obj.movieTitle}
                                <small>${obj.RatingUrl}: 3/5</small>
                            </h5>
                        </div>
                        <div class="card-body">
                            <figure>
                                <img src="${obj.movieUrl}" class="img-fluid" alt="movieImg" title="movieImg">
                                <figcaption>
                                    <p>${obj.Discription}</p>
                                </figcaption>
                            </figure>
                        </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-success" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
                        </div>
        `
    }).join("")
}
const creatSingleMoviesCard=(moviesObj)=>{
    let card= document.createElement("div");
    card.className=`card m-0`
    card.id=moviesObj.id
    card.innerHTML= `
    <div class="card-header">
                            <h5 class="m-0 d-flex justify-content-between">
                               ${moviesObj.movieTitle}
                                <small>${moviesObj.RatingUrl}: 3/5</small>
                            </h5>
                        </div>
                        <div class="card-body">
                            <figure>
                                <img src="${moviesObj.movieUrl}" class="img-fluid" alt="movieImg" title="movieImg">
                                <figcaption>
                                    <p>${moviesObj.Discription}</p>
                                </figcaption>
                            </figure>
                        </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-success" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>
    `
    moviesContainer.append(card)
}

const makeApicall =(MethodName,apiurl,msgBody=null)=>{
    return new Promise((resolve, reject) => {
        loader.classList.remove("d-none")
        let xhr= new XMLHttpRequest()
        xhr.open(MethodName,apiurl)
        xhr.send(JSON.stringify(msgBody))
        xhr.onload= function(){
            if(xhr.status>=200 && xhr.status<300 && xhr.readyState===4){
                resolve(JSON.parse(xhr.response))
            }else{
                reject("something went wrong")
            }
        }
    })
}

makeApicall("GET", postUrl)
.then((res)=>{
    cl(res)
    moviearr=[]
    for (const key in res) {
       let obj={...res[key], id:key}
       moviearr.push(obj)
       creatTemplating(moviearr)
       Swal.fire({
        title: " all Movies  created successfully  !",
        icon: "success",
        timer:2000
      });
    }
})
.catch((err)=>{
    cl(err)
})
.finally(()=>{
    loader.classList.add("d-none")
})

const onsubmitBtn=(eve)=>{
    eve.preventDefault()
    let moviesObj={
        movieTitle:movieTitleControl.value,
        movieUrl:movieUrlControl.value,
        Discription:DiscriptionControl.value,
        RatingUrl:RatingUrlControl.value
    }
    cl(moviesObj)
    makeApicall("Post",postUrl,moviesObj)
    .then((res)=>{
        creatSingleMoviesCard(moviesObj)
        Swal.fire({
            title: " Created single Movies  successfully !",
            icon: "success",
            timer:2000
          });
        
    })
    .catch((err)=>{
        cl(err)
    })
    .finally(()=>{
        moviesCard.reset()
        loader.classList.add("d-none")
    })
 makeApicall("POST",postUrl,moviesObj)
 .then((res)=>{
    cl(res)
 })
 .catch((err)=>{
    cl(err)
 })
 .finally(()=>{
    loader.classList.add("d-none")
 })
 
 }
 const onpdateBtn=()=>{
    let updatedMovies={
        movieTitle:movieTitleControl.value,
        movieUrl:movieUrlControl.value,
        Discription:DiscriptionControl.value,
        RatingUrl:RatingUrlControl.value
    }
    cl(updatedMovies);
    
    let updatedId=localStorage.getItem("editId")
    updatedurl=`${baseUrl}/movies/${updatedId}.json`
      makeApicall("PATCH",updatedurl,updatedMovies)
      .then((res)=>{
        updatedMovies.id=updatedId
        let card=[...document.getElementById(updatedMovies.id).children]
        card[0].innerHTML=` <h4 class="m-0">${updatedMovies.movieTitle}</h4>`
        card[1].innerHTML=`<h5 class="m-0">${updatedMovies.movieUrl}</h5>
                           <p class="m-0">${updatedMovies.Discription}</p>`

                           Swal.fire({
                            title: "Movies updated successfully !",
                            icon: "success",
                            timer:2000
                          });
        
      })
      .catch((err)=>{
        cl(err)
      })
      .finally(()=>{
        moviesCard.reset()
        submitBtn.classList.remove("d-none");
        updatedBtn.classList.add("d-none")
        loader.classList.add("d-none")
        
      })
 }
moviesCard.addEventListener("submit",onsubmitBtn)
 updatedBtn.addEventListener("click",onpdateBtn)



 
    

   