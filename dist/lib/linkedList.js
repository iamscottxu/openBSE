"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 双向链表类
 */
var LinkedList = function () {
  /**
   * 创建一个双向链表。
   */
  function LinkedList() {
    _classCallCheck(this, LinkedList);

    this._topNode = new LinkedList.node(null);
    this._bottomNode = new LinkedList.node(null);
    this._length = 0;
    this._topNode._next = this._bottomNode;
    this._bottomNode._previous = this._topNode;
    this._topNode._linkedList = this._bottomNode._linkedList = this;
  }
  /**
   * 获取元素个数
   * @returns {number} 元素个数
   */


  _createClass(LinkedList, [{
    key: "push",

    /**
     * 插入节点
     * @param {*} node - 节点
     * @param {boolean} top - true: 插入到顶部 false: 插入到底部
     */
    value: function push(node) {
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (top) return this._topNode.add(node, false);else return this._bottomNode.add(node, true);
    }
    /**
     * 读取元素
     * @param {boolean} remove - 读取后是否删除
     * @param {boolean} top - true: 读取顶部 false: 读取底部
     * @returns {*} 节点
     */

  }, {
    key: "pop",
    value: function pop() {
      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var thisNode;
      if (top) thisNode = this._topNode.next;else thisNode = this._bottomNode.previous;
      if (thisNode != null && remove) thisNode.remove();
      return thisNode;
    }
    /**
     * 清空链表
     */

  }, {
    key: "clean",
    value: function clean() {
      this._topNode._next = this._bottomNode;
      this._bottomNode._previous = this._topNode;
      this._length = 0;
    }
    /**
     * 遍历链表
     * @param {function} fun - 遍历回调函数
     * 回调函数（参数：元素，返回：{remove：删除此元素，add:插入节点(add.addToUp:插入到上方, add.node:节点), stop：停止遍历}）
     * @param {boolean} topToBottom - true: 从顶到底 false: 从底到顶
     */

  }, {
    key: "forEach",
    value: function forEach(fun, topToBottom) {
      var thisNode = topToBottom ? this._topNode : this._bottomNode;
      var nextNode = topToBottom ? thisNode._next : thisNode._previous;

      while (topToBottom ? (thisNode = nextNode) != this._bottomNode : (thisNode = nextNode) != this._topNode) {
        nextNode = topToBottom ? thisNode._next : thisNode._previous;

        var _return = fun(thisNode);

        if (_return) {
          if (_return.add) thisNode.add(_return.add.node, _return.add.addToUp);
          if (_return.remove) thisNode.remove();
          if (_return.stop) return;
        }
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this._length;
    }
  }], [{
    key: "node",

    /**
     * 双向链表节点
     * @private
    */
    get: function get() {
      return function () {
        /**
         * 创建一个双向链表节点。
         * @param {*} element - 元素
         */
        function _class(element) {
          _classCallCheck(this, _class);

          this._element = element;
          this._next = null;
          this._previous = null;
          this._linkedList = null;
        }
        /**
         * 获取元素。
         */


        _createClass(_class, [{
          key: "add",

          /**
           * 添加双向链表节点。
           * @param {*} node - 节点
           * @param {*} addToUp - 插入到上方
           */
          value: function add(node) {
            var addToUp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            node.remove();

            if (addToUp) {
              node._previous = this._previous;
              node._next = this;
              this._previous._next = node;
              this._previous = node;
            } else {
              node._previous = this;
              node._next = this._next;
              this._next._previous = node;
              this._next = node;
            }

            node._linkedList = this._linkedList;
            this._linkedList._length++;
            return true;
          }
        }, {
          key: "remove",
          value: function remove() {
            if (this._next == null || this._previous == null || this._linkedList == null) return false;
            this._previous._next = this._next;
            this._next._previous = this._previous;
            this._next = this._previous = null;
            this._linkedList._length--;
            this._linkedList = null;
            return true;
          }
        }, {
          key: "element",
          get: function get() {
            return this._element;
          }
          /**
           * 获取双向链表。
           */

        }, {
          key: "linkedList",
          get: function get() {
            return this._linkedList;
          }
          /**
           * 获取上一个双向链表节点。
           */

        }, {
          key: "previous",
          get: function get() {
            if (this._linkedList === null || this._previous === this._linkedList._topNode) return null;else return this._previous;
          }
          /**
           * 获取下一个双向链表节点。
           */

        }, {
          key: "next",
          get: function get() {
            if (this._linkedList === null || this._next === this._linkedList._bottomNode) return null;else return this._next;
          }
        }]);

        return _class;
      }();
    }
  }]);

  return LinkedList;
}();

exports["default"] = LinkedList;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9saW5rZWRMaXN0LmpzIl0sIm5hbWVzIjpbIkxpbmtlZExpc3QiLCJfdG9wTm9kZSIsIm5vZGUiLCJfYm90dG9tTm9kZSIsIl9sZW5ndGgiLCJfbmV4dCIsIl9wcmV2aW91cyIsIl9saW5rZWRMaXN0IiwidG9wIiwiYWRkIiwicmVtb3ZlIiwidGhpc05vZGUiLCJuZXh0IiwicHJldmlvdXMiLCJmdW4iLCJ0b3BUb0JvdHRvbSIsIm5leHROb2RlIiwiX3JldHVybiIsImFkZFRvVXAiLCJzdG9wIiwiZWxlbWVudCIsIl9lbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0lBR3FCQSxVO0FBQ2pCOzs7QUFHQSx3QkFBYztBQUFBOztBQUVWLFNBQUtDLFFBQUwsR0FBZ0IsSUFBSUQsVUFBVSxDQUFDRSxJQUFmLENBQW9CLElBQXBCLENBQWhCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixJQUFJSCxVQUFVLENBQUNFLElBQWYsQ0FBb0IsSUFBcEIsQ0FBbkI7QUFDQSxTQUFLRSxPQUFMLEdBQWUsQ0FBZjtBQUNBLFNBQUtILFFBQUwsQ0FBY0ksS0FBZCxHQUFzQixLQUFLRixXQUEzQjtBQUNBLFNBQUtBLFdBQUwsQ0FBaUJHLFNBQWpCLEdBQTZCLEtBQUtMLFFBQWxDO0FBQ0EsU0FBS0EsUUFBTCxDQUFjTSxXQUFkLEdBQTRCLEtBQUtKLFdBQUwsQ0FBaUJJLFdBQWpCLEdBQStCLElBQTNEO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBT0E7Ozs7O3lCQUtLTCxJLEVBQWtCO0FBQUEsVUFBWk0sR0FBWSx1RUFBTixJQUFNO0FBQ25CLFVBQUlBLEdBQUosRUFBUyxPQUFPLEtBQUtQLFFBQUwsQ0FBY1EsR0FBZCxDQUFrQlAsSUFBbEIsRUFBd0IsS0FBeEIsQ0FBUCxDQUFULEtBQ0ssT0FBTyxLQUFLQyxXQUFMLENBQWlCTSxHQUFqQixDQUFxQlAsSUFBckIsRUFBMkIsSUFBM0IsQ0FBUDtBQUNSO0FBQ0Q7Ozs7Ozs7OzswQkFNK0I7QUFBQSxV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QUFDQSxtQkFBTyxJQUFQO0FBQ0g7QUExREw7QUFBQTtBQUFBLG1DQTJEYTtBQUNMLGdCQUFJLEtBQUtDLEtBQUwsSUFBYyxJQUFkLElBQXNCLEtBQUtDLFNBQUwsSUFBa0IsSUFBeEMsSUFDQSxLQUFLQyxXQUFMLElBQW9CLElBRHhCLEVBQzhCLE9BQU8sS0FBUDtBQUM5QixpQkFBS0QsU0FBTCxDQUFlRCxLQUFmLEdBQXVCLEtBQUtBLEtBQTVCO0FBQ0EsaUJBQUtBLEtBQUwsQ0FBV0MsU0FBWCxHQUF1QixLQUFLQSxTQUE1QjtBQUNBLGlCQUFLRCxLQUFMLEdBQWEsS0FBS0MsU0FBTCxHQUFpQixJQUE5QjtBQUNBLGlCQUFLQyxXQUFMLENBQWlCSCxPQUFqQjtBQUNBLGlCQUFLRyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsbUJBQU8sSUFBUDtBQUNIO0FBcEVMO0FBQUE7QUFBQSw4QkFja0I7QUFDVixtQkFBTyxLQUFLYyxRQUFaO0FBQ0g7QUFDRDs7OztBQWpCSjtBQUFBO0FBQUEsOEJBb0JxQjtBQUNiLG1CQUFPLEtBQUtkLFdBQVo7QUFDSDtBQUNEOzs7O0FBdkJKO0FBQUE7QUFBQSw4QkEwQm1CO0FBQ1gsZ0JBQUksS0FBS0EsV0FBTCxLQUFxQixJQUFyQixJQUE2QixLQUFLRCxTQUFMLEtBQW1CLEtBQUtDLFdBQUwsQ0FBaUJOLFFBQXJFLEVBQStFLE9BQU8sSUFBUCxDQUEvRSxLQUNLLE9BQU8sS0FBS0ssU0FBWjtBQUNSO0FBQ0Q7Ozs7QUE5Qko7QUFBQTtBQUFBLDhCQWlDZTtBQUNQLGdCQUFJLEtBQUtDLFdBQUwsS0FBcUIsSUFBckIsSUFBNkIsS0FBS0YsS0FBTCxLQUFlLEtBQUtFLFdBQUwsQ0FBaUJKLFdBQWpFLEVBQThFLE9BQU8sSUFBUCxDQUE5RSxLQUNLLE9BQU8sS0FBS0UsS0FBWjtBQUNSO0FBcENMOztBQUFBO0FBQUE7QUFzRUgiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOWPjOWQkemTvuihqOexu1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rZWRMaXN0IHtcbiAgICAvKipcbiAgICAgKiDliJvlu7rkuIDkuKrlj4zlkJHpk77ooajjgIJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy/liJ3lp4vljJZcbiAgICAgICAgdGhpcy5fdG9wTm9kZSA9IG5ldyBMaW5rZWRMaXN0Lm5vZGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2JvdHRvbU5vZGUgPSBuZXcgTGlua2VkTGlzdC5ub2RlKG51bGwpO1xuICAgICAgICB0aGlzLl9sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl90b3BOb2RlLl9uZXh0ID0gdGhpcy5fYm90dG9tTm9kZTtcbiAgICAgICAgdGhpcy5fYm90dG9tTm9kZS5fcHJldmlvdXMgPSB0aGlzLl90b3BOb2RlO1xuICAgICAgICB0aGlzLl90b3BOb2RlLl9saW5rZWRMaXN0ID0gdGhpcy5fYm90dG9tTm9kZS5fbGlua2VkTGlzdCA9IHRoaXM7XG4gICAgfVxuICAgIC8v5YWs5YWx5Ye95pWwXG4gICAgLyoqXG4gICAgICog6I635Y+W5YWD57Sg5Liq5pWwXG4gICAgICogQHJldHVybnMge251bWJlcn0g5YWD57Sg5Liq5pWwXG4gICAgICovXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlbmd0aDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5o+S5YWl6IqC54K5XG4gICAgICogQHBhcmFtIHsqfSBub2RlIC0g6IqC54K5XG4gICAgICogQHBhcmFtIHtib29sZWFufSB0b3AgLSB0cnVlOiDmj5LlhaXliLDpobbpg6ggZmFsc2U6IOaPkuWFpeWIsOW6lemDqFxuICAgICAqL1xuICAgIHB1c2gobm9kZSwgdG9wID0gdHJ1ZSkge1xuICAgICAgICBpZiAodG9wKSByZXR1cm4gdGhpcy5fdG9wTm9kZS5hZGQobm9kZSwgZmFsc2UpO1xuICAgICAgICBlbHNlIHJldHVybiB0aGlzLl9ib3R0b21Ob2RlLmFkZChub2RlLCB0cnVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog6K+75Y+W5YWD57SgXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZW1vdmUgLSDor7vlj5blkI7mmK/lkKbliKDpmaRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRvcCAtIHRydWU6IOivu+WPlumhtumDqCBmYWxzZTog6K+75Y+W5bqV6YOoXG4gICAgICogQHJldHVybnMgeyp9IOiKgueCuVxuICAgICAqL1xuICAgIHBvcChyZW1vdmUgPSB0cnVlLCB0b3AgPSB0cnVlKSB7XG4gICAgICAgIGxldCB0aGlzTm9kZTtcbiAgICAgICAgaWYgKHRvcCkgdGhpc05vZGUgPSB0aGlzLl90b3BOb2RlLm5leHQ7XG4gICAgICAgIGVsc2UgdGhpc05vZGUgPSB0aGlzLl9ib3R0b21Ob2RlLnByZXZpb3VzO1xuICAgICAgICBpZiAodGhpc05vZGUgIT0gbnVsbCAmJiByZW1vdmUpIHRoaXNOb2RlLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdGhpc05vZGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOa4heepuumTvuihqFxuICAgICAqL1xuICAgIGNsZWFuKCkge1xuICAgICAgICB0aGlzLl90b3BOb2RlLl9uZXh0ID0gdGhpcy5fYm90dG9tTm9kZTtcbiAgICAgICAgdGhpcy5fYm90dG9tTm9kZS5fcHJldmlvdXMgPSB0aGlzLl90b3BOb2RlO1xuICAgICAgICB0aGlzLl9sZW5ndGggPSAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDpgY3ljobpk77ooahcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW4gLSDpgY3ljoblm57osIPlh73mlbBcbiAgICAgKiDlm57osIPlh73mlbDvvIjlj4LmlbDvvJrlhYPntKDvvIzov5Tlm57vvJp7cmVtb3Zl77ya5Yig6Zmk5q2k5YWD57Sg77yMYWRkOuaPkuWFpeiKgueCuShhZGQuYWRkVG9VcDrmj5LlhaXliLDkuIrmlrksIGFkZC5ub2RlOuiKgueCuSksIHN0b3DvvJrlgZzmraLpgY3ljoZ977yJXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0b3BUb0JvdHRvbSAtIHRydWU6IOS7jumhtuWIsOW6lSBmYWxzZTog5LuO5bqV5Yiw6aG2XG4gICAgICovXG4gICAgZm9yRWFjaChmdW4sIHRvcFRvQm90dG9tKSB7XG4gICAgICAgIGxldCB0aGlzTm9kZSA9IHRvcFRvQm90dG9tID8gdGhpcy5fdG9wTm9kZSA6IHRoaXMuX2JvdHRvbU5vZGU7XG4gICAgICAgIGxldCBuZXh0Tm9kZSA9IHRvcFRvQm90dG9tID8gdGhpc05vZGUuX25leHQgOiB0aGlzTm9kZS5fcHJldmlvdXM7XG4gICAgICAgIHdoaWxlICh0b3BUb0JvdHRvbSA/ICh0aGlzTm9kZSA9IG5leHROb2RlKSAhPSB0aGlzLl9ib3R0b21Ob2RlIDogKHRoaXNOb2RlID0gbmV4dE5vZGUpICE9IHRoaXMuX3RvcE5vZGUpIHtcbiAgICAgICAgICAgIG5leHROb2RlID0gdG9wVG9Cb3R0b20gPyB0aGlzTm9kZS5fbmV4dCA6IHRoaXNOb2RlLl9wcmV2aW91cztcbiAgICAgICAgICAgIGxldCBfcmV0dXJuID0gZnVuKHRoaXNOb2RlKTtcbiAgICAgICAgICAgIGlmIChfcmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9yZXR1cm4uYWRkKSB0aGlzTm9kZS5hZGQoX3JldHVybi5hZGQubm9kZSwgX3JldHVybi5hZGQuYWRkVG9VcCk7XG4gICAgICAgICAgICAgICAgaWYgKF9yZXR1cm4ucmVtb3ZlKSB0aGlzTm9kZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBpZiAoX3JldHVybi5zdG9wKSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOWPjOWQkemTvuihqOiKgueCuVxuICAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBzdGF0aWMgZ2V0IG5vZGUoKSB7XG4gICAgICAgIHJldHVybiBjbGFzcyB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOWIm+W7uuS4gOS4quWPjOWQkemTvuihqOiKgueCueOAglxuICAgICAgICAgICAgICogQHBhcmFtIHsqfSBlbGVtZW50IC0g5YWD57SgXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91cyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlua2VkTGlzdCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOiOt+WPluWFg+e0oOOAglxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6I635Y+W5Y+M5ZCR6ZO+6KGo44CCXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldCBsaW5rZWRMaXN0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5rZWRMaXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDojrflj5bkuIrkuIDkuKrlj4zlkJHpk77ooajoioLngrnjgIJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0IHByZXZpb3VzKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW5rZWRMaXN0ID09PSBudWxsIHx8IHRoaXMuX3ByZXZpb3VzID09PSB0aGlzLl9saW5rZWRMaXN0Ll90b3BOb2RlKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiB0aGlzLl9wcmV2aW91cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6I635Y+W5LiL5LiA5Liq5Y+M5ZCR6ZO+6KGo6IqC54K544CCXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldCBuZXh0KCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW5rZWRMaXN0ID09PSBudWxsIHx8IHRoaXMuX25leHQgPT09IHRoaXMuX2xpbmtlZExpc3QuX2JvdHRvbU5vZGUpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuX25leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOa3u+WKoOWPjOWQkemTvuihqOiKgueCueOAglxuICAgICAgICAgICAgICogQHBhcmFtIHsqfSBub2RlIC0g6IqC54K5XG4gICAgICAgICAgICAgKiBAcGFyYW0geyp9IGFkZFRvVXAgLSDmj5LlhaXliLDkuIrmlrlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYWRkKG5vZGUsIGFkZFRvVXAgPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRkVG9VcCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLl9wcmV2aW91cyA9IHRoaXMuX3ByZXZpb3VzO1xuICAgICAgICAgICAgICAgICAgICBub2RlLl9uZXh0ID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXMuX25leHQgPSBub2RlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91cyA9IG5vZGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5fcHJldmlvdXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBub2RlLl9uZXh0ID0gdGhpcy5fbmV4dDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dC5fcHJldmlvdXMgPSBub2RlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZXh0ID0gbm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZS5fbGlua2VkTGlzdCA9IHRoaXMuX2xpbmtlZExpc3Q7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlua2VkTGlzdC5fbGVuZ3RoKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmUoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX25leHQgPT0gbnVsbCB8fCB0aGlzLl9wcmV2aW91cyA9PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmtlZExpc3QgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzLl9uZXh0ID0gdGhpcy5fbmV4dDtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0Ll9wcmV2aW91cyA9IHRoaXMuX3ByZXZpb3VzO1xuICAgICAgICAgICAgICAgIHRoaXMuX25leHQgPSB0aGlzLl9wcmV2aW91cyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlua2VkTGlzdC5fbGVuZ3RoLS07XG4gICAgICAgICAgICAgICAgdGhpcy5fbGlua2VkTGlzdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbiJdLCJmaWxlIjoibGliL2xpbmtlZExpc3QuanMifQ==
