(()=>{
  'use strict';

  const lists = document.getElementsByTagName('ul')[0];
  const menu = document.getElementsByClassName('menu')[0];
  let prevEle = '';

  /*
    Mouse positions
    pageX --> x coordinate of the mouse pointer relative to document.
    pageY --> y coordinate of the mouse pointer relative to document.
    offsetX --> how far clientX is from the left edge of the clicked element.
    offsetY --> how far clientY is from the top edge of the clicked element.
    clientWidth --> total width of the element including padding.
  */
  const getPosition =(e)=>{
    return {
      left: e.pageX - e.offsetX + e.target.clientWidth,
      top: e.pageY - e.offsetY
    }
  }

  /*
    Append context menu on the right edge of the elements.
  */
  const appendMenu = (e)=>{
    let pos = getPosition(e);
    menu.style.top = pos.top + 'px';
    menu.style.left = pos.left + 'px';
    menu.style.display = 'block';
  }

  /*
    Focus element on right click and show the context menu.
  */
  const focusElement = (e)=>{
    if(prevEle != e.target){
      if(prevEle.classList){
        prevEle.classList.remove('focused');
        prevEle.setAttribute('contenteditable', false);
      }
      prevEle = e.target;
      prevEle.classList.add('focused');
      appendMenu(e);
    }else if(menu.style.display == 'none'){
      appendMenu(e);
    }
  }

  /*
    Show context menu on list items.
  */
  const showContextMenus = (e)=>{
    if(e.target.tagName === "LI"){
      e.preventDefault();
      focusElement(e);
    }
  }

  /*
    NOTE: This is experimental.
    Create Range for the task. Set start from the element text end.
    True collapses the range to start which is at text end already.
    Selection returns the range of text selected by user or the current position of cursor.
    Add range to this selection. Then focus.
  */
  const focusAtEnd = ()=>{
    let range = document.createRange();
    let textNode = prevEle.childNodes[0]
    range.setStart(textNode, textNode.length);
    range.collapse(true);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    prevEle.focus();
  }

  const delteListItem = ()=>{
    lists.removeChild(prevEle);
  }

  /*
    Perfrom some action based on context menu events.
  */
  const performAction =(e)=>{
    menu.style.display = 'none';
    let textContent = e.target.textContent;
    switch (textContent) {

      case "Edit":
        prevEle.setAttribute('contenteditable', true);
        focusAtEnd();
        break;

      case "Delete":
        delteListItem();
        break;

      default:

    }
  }

  /*
    Press enter after editing to finish.
  */
  const doneEditing = (e)=>{
    if (e.keyCode === 13){
      e.preventDefault();
      prevEle.setAttribute('contenteditable', false);
    }
  }

  /*
    Bind events.
  */
  const bindEvents = () =>{
    lists.addEventListener('contextmenu', showContextMenus, false);
    menu.addEventListener('click', performAction, false);
    lists.addEventListener('keypress', doneEditing, false)
  }

  const init = () =>{
    bindEvents();
  }

  /*
    Initialize dom events.
  */
  init();
})();
