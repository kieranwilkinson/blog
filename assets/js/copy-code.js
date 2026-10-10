(function () {
  document.querySelectorAll(".highlight").forEach(function (block) {
    var code = block.querySelector("code");
    if (!code) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");

    button.addEventListener("click", function () {
      var clone = code.cloneNode(true);
      clone.querySelectorAll(".ln").forEach(function (ln) { ln.remove(); });
      var text = clone.textContent.replace(/\n$/, "");

      var done = function (label) {
        button.textContent = label;
        setTimeout(function () { button.textContent = "Copy"; }, 1500);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { done("Copied"); },
          function () { done("Failed"); }
        );
      } else {
        var area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); done("Copied"); } catch (e) { done("Failed"); }
        area.remove();
      }
    });

    block.appendChild(button);
  });
})();
