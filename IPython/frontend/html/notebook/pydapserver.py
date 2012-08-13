from os.path import dirname, join as join_path, expanduser, abspath

from pydap.wsgi.file import FileServer


class Server(FileServer):
    def __init__(self, path):
        templates = join_path(dirname(__file__), 'pydap_templates')
        self._root = self._fix_root(path)
        FileServer.__init__(self, self._root, templates)

    def __call__(self, env, start_response):
        # path is /<pydap_url>:<data_root>:<data_path>
        path = env['PATH_INFO'].split(':')
        if len(path) >= 3:
            url, root = path[:2]
            path = ':'.join(path[2:])
        else:
            # unexpected path format: just use previous root and top-level path
            url = path[0]
            root = self.root
            path = '/'
        self.root = self._fix_root(root)
        if not path:
            path = '/'
        env['PATH_INFO'] = path
        # let pydap know where it is
        env['SCRIPT_NAME'] = url + ':' + root + ':'
        return FileServer.__call__(self, env, start_response)

    def _fix_root (self, root):
        root = abspath(expanduser(root).rstrip('/'))
        if not root:
            root = '/'
        return root
