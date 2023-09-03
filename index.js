// load all data
const loadData = async () => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/videos/categories`
  );
  const data = await res.json();
  const categories = data.data;
  displayCategories(categories);
};

// display the categories button
const displayCategories = (categories) => {
  const buttonContainer = document.getElementById("button-container");

  categories.forEach((category) => {
    const buttonDiv = document.createElement("div");
    const dynamicButton = document.createElement("button");
    dynamicButton.innerText = category.category;
    dynamicButton.classList = `btn text-xs md:text-sm px-2 md:px-4`;
    dynamicButton.addEventListener("click", function () {
      if (dynamicButton.style.backgroundColor === "") {
        dynamicButton.style.backgroundColor = "rgb(239 68 68)";
        dynamicButton.style.color = "white";
      } else {
        dynamicButton.style.backgroundColor = "";
        dynamicButton.style.color = "";
      }
      showDetails(category.category_id);
    });
    buttonDiv.appendChild(dynamicButton);
    buttonContainer.appendChild(buttonDiv);
  });
};

// load the dynamic categories id
const showDetails = async (Id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${Id}`
  );
  const info = await res.json();
  const cardInfos = info.data;
  displayCard(cardInfos);
  convertToHourMinute(cardInfos);

  // handle for sort
  document.getElementById("sort-btn").addEventListener("click", function () {
    sortData(cardInfos);
  });
};

// create the dynamic card
const displayCard = (cardInfos) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.textContent = "";
  if (cardInfos.length === 0) {
    const emptyField = document.createElement("div");
    emptyField.classList = `card w-96 my-auto text-center md:ml-56  lg:ml-96`;
    emptyField.innerHTML = `<div>
     <figure class="px-10 pt-10">
       <img src="./Icon.png" class="rounded-xl" />
     </figure>
     <div class="card-body items-center text-center">
       <h2 class="card-title text-xl">Oops!! Sorry, There is no <br> 
         content here</h2>
     </div>
   </div>`;

    cardContainer.appendChild(emptyField);
  }

  cardInfos.forEach((cardInfo) => {
    const singleCard = document.createElement("div");
    singleCard.classList = `card bg-base-100 shadow-xl relative`;
    const seconds = cardInfo?.others?.posted_date;
    const { hours, minutes } = secondToHourAndMinute(seconds);

    const timer = document.createElement("p");
    timer.id = "timer";
    timer.className = "absolute top-32 right-7 bg-black text-white text-xs";

    if (hours === 0 && minutes === 0) {
      timer.style.display = "none";
    } else {
      timer.textContent = `${hours}hrs ${minutes}min ago`;
    }

    singleCard.innerHTML = `
         <figure><img class='w-[80%] lg:h-40 ' src=${
           cardInfo?.thumbnail
         } /></figure>
         <div class="card-body">
           <div class="flex gap-2">
             <div><img class='rounded-full  w-5 md:w-7 lg:w-7 h-5 md:h-7 lg:h-7' src=${
               cardInfo?.authors[0]?.profile_picture
             } /></div>
             <h3 class='bold'>${cardInfo?.title}</h3>
           </div>
           <div class='flex text-sm'> 
                 <span>${cardInfo?.authors[0]?.profile_name}</span>
                 <img src="${
                   cardInfo?.authors[0]?.verified ? "./fi_10629607.svg" : ""
                 }" />
           </div>
           <p class='-mt-2'>${cardInfo?.others?.views} <span>Views</span> </p>
         </div>
     `;

    singleCard.appendChild(timer);
    cardContainer.appendChild(singleCard);
  });
};

// create the convert hour minute function
const convertToHourMinute = (cardInfos) => {
  cardInfos.forEach((postTime) => {
    const seconds = postTime?.others?.posted_date;
    secondToHourAndMinute(seconds);
  });
};

const secondToHourAndMinute = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  return { hours, minutes };
};

// Make the sort array
const sortData = (cardInfos) => {
  cardInfos.sort((a, b) => {
    const x = parseInt(a.others.views.slice(0, -1)) * 1000;
    const y = parseInt(b.others.views.slice(0, -1)) * 1000;
    return y - x;
  });
  displayCard(cardInfos);
};

// for go blog page
const openBlogPage = () => {
  const blogUrl = "blog.html";
  window.open(blogUrl, "_blank");
};

// call the function
loadData();
showDetails("1000");
