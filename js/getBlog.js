document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/api/blog')
        .then(response => response.json())
        .then(data => {
            const container = $('#blog-container');
            container.empty();
            data.forEach(blog => {
                const blogItem = `
                <div class="col-md-4 mb-4 pb-2">
                    <div class="blog-item">
                        <div class="position-relative">
                            <img class="img-fluid w-100 h-100" src="${blog.image}" alt="img" style="object-fit: cover;">
                            <div class="blog-date">
                                <h6 class="font-weight-bold mb-n1">${new Date(blog.createdAt).getDate()}</h6>
                                <small class="text-white text-uppercase">${new Date(blog.createdAt).toLocaleString('default', { month: 'short' })}</small>
                            </div>
                        </div>
                        <div class="bg-white p-4">
                            <a class="h5 m-0 text-decoration-none" href="./blogpost.html?id=${blog._id}">${blog.title}</a>
                        </div>
                    </div>
                </div>`;

                container.append(blogItem);
            });
        });
});

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get('id');

    if (blogId) {
        try {
            const response = await fetch(`http://localhost:5000/api/blog/${blogId}`);
            const blog = await response.json();
            console.log(blog)

            if (response.ok) {
                document.getElementById('blog-title').innerText = blog.title;

                // Format date to display the full month name
                const formattedDate = new Date(blog.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                document.getElementById('blog-date').innerText = formattedDate;

                const blogImage = document.getElementById('blog-image');
                blogImage.src = blog.image || 'https://images.pexels.com/photos/33582/sunrise-phu-quoc-island-ocean.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                blogImage.alt = blog.title;

                const blogVideo = document.getElementById('blog-video');
                if (blog.videoUrl) {
                    // Extract the YouTube video ID from the URL
                    const videoId = blog.videoUrl.split('v=')[1]?.split('&')[0];

                    if (videoId) {
                        // Construct the embed URL
                        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

                        // Create iframe element and set attributes
                        const iframe = document.createElement('iframe');
                        iframe.setAttribute('width', '100%');
                        iframe.setAttribute('height', '500');
                        iframe.setAttribute('src', embedUrl);
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                        iframe.setAttribute('allowfullscreen', 'true');

                        // Add the iframe to the blog-video container
                        blogVideo.innerHTML = ''; // Clear previous content if any
                        blogVideo.appendChild(iframe);

                        // Display the video container
                        blogVideo.style.display = 'block';
                    } else {
                        blogVideo.style.display = 'none'; // Hide if no valid video ID
                    }
                } else {
                    blogVideo.style.display = 'none'; // Hide if no video URL is provided
                }

                const blogText = document.getElementById('blog-text');
                blogText.innerHTML = blog.text.replace(/\n/g, '<br>');  // Text formatting for readability
            } else {
                document.getElementById('blog-text').innerHTML = `<p class="text-danger">${blog.error || 'Blog not found.'}</p>`;
            }
        } catch (error) {
            document.getElementById('blog-text').innerHTML = '<p class="text-danger">Failed to load the blog. Please try again later.</p>';
        }
    } else {
        document.getElementById('blog-text').innerHTML = '<p class="text-warning">No blog ID provided.</p>';
    }
});
