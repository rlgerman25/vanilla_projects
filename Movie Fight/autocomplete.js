const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

    //Creates HTML elements in JavaScript to display the dropdown menu.
    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"> </div>
        </div>
    </div>    
`;

    const input = root.querySelector("input");
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results");

    //Promise function, hence "async" and "await," to fetch the data values.
    const onInput = async event => {
        const items = await fetchData(event.target.value);

        //If statement so the dropdown dissapears after every query search.
        if (!items.length) {
            dropdown.classList.remove("is-active");
            return;
        }

        //clears the search bar of the string. Else search results stay.
        resultsWrapper.innerHTML = "";
        dropdown.classList.add("is-active");
        for (let item of items) {
            const option = document.createElement("a");
            //Ternary operator that checks if the item has an image or "Poster." 
            //If it doesn't it will return no image

            option.classList.add("dropdown-item");
            option.innerHTML = renderOption(item);
            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(item);
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(option);
        }
    };

    //Use of debounce function so the API does not launch a search immediately, but rather waits 1 second
    //to search - doesn't exhaust the number of searches per day - For function see file "utils.js".
    input.addEventListener("input", debounce(onInput, 1000));

    //Handles event so menu retracts when the user clicks outside the the menu or "root" element in this case. 
    document.addEventListener("click", event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove("is-active");
        }
    });

}