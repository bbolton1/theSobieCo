//Beth Ann Tucker
// Notification data is now stored in an array
const notifications = [
    {
      title: "Online Registration Now Available",
      details: "2025 online registration form is now available. No more 'email generation form' or copy/paste.",
      date: "Feb 12, 2025",
      read: false,
      expanded: false
    },
    {
      title: "Call for Papers & Resort Discount Code",
      details: "2025 Call for papers and resort discount code now available!",
      date: "Jan. 8, 2025",
      read: false,
      expanded: false
    }
  ];
  
  // Runs the code after the page is fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    const notificationList = document.getElementById("notification-list"); // The container for all notifications
    const badge = document.getElementById("notification-count"); // The red badge showing unread count
  
    // Renders the notifications on the page
    function renderNotifications() {
      notificationList.innerHTML = ""; // Clear the list before re-rendering
  
      notifications.forEach((notif, index) => {
        const notifDiv = document.createElement("div");
        notifDiv.className = "notification";
        if (notif.read) notifDiv.classList.add("read"); // Add read class if it's read
        if (notif.expanded) notifDiv.classList.add("expanded"); // Add expanded class if it's expanded
  
        // Add index and swipe event attributes
        notifDiv.setAttribute("data-index", index);
        notifDiv.setAttribute("ontouchstart", "handleTouchStart(event)");
        notifDiv.setAttribute("ontouchmove", "handleTouchMove(event, this)");
        notifDiv.setAttribute("ontouchend", "handleTouchEnd(event, this)");
  
        // Create and fill in summary (title) of notification
        const summary = document.createElement("div");
        summary.className = "summary";
        summary.textContent = notif.title;
  
        // Create and fill in full details of notification
        const details = document.createElement("div");
        details.className = "details";
        details.innerHTML = `${notif.details} <br> ${notif.date}`;
        details.style.display = notif.expanded ? 'block' : 'none'; // Show if expanded
  
        // When user clicks the notification
        notifDiv.addEventListener("click", function (e) {
          e.stopPropagation(); // Prevent it from closing the list
          notif.read = true; // Mark as read
          notif.expanded = true; // Expand to show full message
          notifDiv.classList.add("read", "expanded");
          details.style.display = 'block'; // Show the details
          updateBadgeCount(); // Update unread count
        });
  
        // Add the summary and details to the notification box
        notifDiv.appendChild(summary);
        notifDiv.appendChild(details);
        // Add the notification box to the list
        notificationList.appendChild(notifDiv);
      });
  
      updateBadgeCount(); // Always update the badge count after rendering
    }
  
    // Updates the unread notification badge count
    function updateBadgeCount() {
      const unreadCount = notifications.filter(n => !n.read).length;
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
  
    // Toggles the visibility of the notifications panel
    window.toggleNotifications = function () {
      const listVisible = notificationList.style.display === "block";
      notificationList.style.display = listVisible ? "none" : "block";
    };
  
  
    // Hide notifications if user clicks outside the list or icon
    document.addEventListener("click", function (event) {
      const icon = document.querySelector(".notification-icon");
      const list = document.getElementById("notification-list");
      if (!icon.contains(event.target) && !list.contains(event.target)) {
        list.style.display = "none";
      }
    });
  
    // First render of notifications on page load
    renderNotifications();
  });
  
