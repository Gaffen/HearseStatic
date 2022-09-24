const getHome = `query {
	home_page {
		bio_copy
		bio_headline
		dpk_link
		dpk_title
		bio_bg {
			id
		}
		carousel(sort: "position") {
			carousel_slide_id {
				image {
					id
				}
				link_new_tab
				link_text
				link_url
				links
				portrait_image {
					id
				}
				subtitle
				title
				type
				video_link
			}
		}
		tracks {
			track_id {
				audio {
					id
				}
			}
		}
	}
}`;

module.exports = {
	getHome,
};
