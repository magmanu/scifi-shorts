document.addEventListener('DOMContentLoaded', function () {
  const storyList = document.getElementById('story-list');
  const filterAuthor = document.getElementById('filter-author');
  const filterRating = document.getElementById('filter-rating');

  fetch('./data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      let stories = data.stories || [];
      stories.reverse();
      stories.forEach(story => addStoryToDOM(story));
    })
    .catch(error => console.error('Error loading stories:', error));


  function addStoryToDOM(story) {
    const storyDiv = document.createElement('div');
    storyDiv.className = 'story';
    storyDiv.dataset.author = story.author.toLowerCase();
    storyDiv.dataset.rating = story.rating;
    storyDiv.innerHTML = `
    <strong>${story.title}</strong> by ${story.author}
    <div class="rating">${'★'.repeat(story.rating)}${'○'.repeat(5 - story.rating)}(${story.rating})</div>
    ${story.spoiler ? '<span class="spoiler-banner">Spoiler</span>' : ''}
    <button class="toggle-summary">Summary</button>
    <button class="toggle-liked">Ups</button>
    <button class="toggle-disliked">Downs</button>
    <div class="content-box"></div>
  `;
    storyList.appendChild(storyDiv);

    const contentBox = storyDiv.querySelector('.content-box');

    const toggleSummaryButton = storyDiv.querySelector('.toggle-summary');
    toggleSummaryButton.addEventListener('click', function () {
      contentBox.textContent = story.summary;
      storyDiv.classList.toggle('expanded-summary');

      storyDiv.classList.remove('expanded-liked');
      storyDiv.classList.remove('expanded-disliked');
      toggleDislikedButton.textContent = 'Downs';
      toggleLikedButton.textContent = 'Ups';
      toggleSummaryButton.textContent = storyDiv.classList.contains('expanded-summary') ? 'Hide' : 'Summary';
    });

    const toggleLikedButton = storyDiv.querySelector('.toggle-liked');
    toggleLikedButton.addEventListener('click', function () {
      contentBox.innerHTML = `<ul>${story.liked.map(item => `<li>${item}</li>`).join('')}</ul>`;
      storyDiv.classList.toggle('expanded-liked');

      storyDiv.classList.remove('expanded-disliked');
      storyDiv.classList.remove('expanded-summary');
      toggleDislikedButton.textContent = 'Downs';
      toggleSummaryButton.textContent = 'Summary';
      toggleLikedButton.textContent = storyDiv.classList.contains('expanded-liked') ? 'Hide' : 'Ups';
    });

    const toggleDislikedButton = storyDiv.querySelector('.toggle-disliked');
    toggleDislikedButton.addEventListener('click', function () {
      contentBox.innerHTML = `<ul>${story.disliked.map(item => `<li>${item}</li>`).join('')}</ul>`;
      storyDiv.classList.toggle('expanded-disliked');

      storyDiv.classList.remove('expanded-liked');
      storyDiv.classList.remove('expanded-summary');
      toggleLikedButton.textContent = 'Ups';
      toggleSummaryButton.textContent = 'Summary';

      toggleDislikedButton.textContent = storyDiv.classList.contains('expanded-disliked') ? 'Hide' : 'Downs';
    });
  }

  function filterStories() {
    const authorFilter = filterAuthor.value.toLowerCase();
    const ratingFilter = filterRating.value;

    document.querySelectorAll('.story').forEach(story => {
      const matchesAuthor = authorFilter === '' || story.dataset.author.includes(authorFilter);
      const matchesRating = ratingFilter === '' || story.dataset.rating === ratingFilter;
      story.style.display = matchesAuthor && matchesRating ? 'block' : 'none';
    });
  }

  filterAuthor.addEventListener('input', filterStories);
  filterRating.addEventListener('input', filterStories);
});

