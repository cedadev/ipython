from os.path import dirname, join as join_path, expanduser, abspath

from pydap.wsgi.file import FileServer


class Server(FileServer):
    def __init__(self, path):
        templates = join_path(dirname(__file__), 'pydap_templates')
        self.root = self._fix_root(path)
        FileServer.__init__(self, self.root, templates)

    def __call__(self, env, start_response):
        # path is /<pydap_url>:<data_root>:<data_path>
        path = env['PATH_INFO'].split(':')
        if len(path) < 3:
            start_response(404)
            return []
        url, root = path[:2]
        path = path[2:]
        # look for escaped : in path that should be part of root
        while root and root[-1] == '_' and root[-2:] != '__':
            root += ':' + path.pop(0)
        orig_root = root
        root = root.replace('_:', ':')
        path = ':'.join(path)
        self.root = self._fix_root(root)
        if not path:
            path = '/'
        env['PATH_INFO'] = path
        # let pydap know where it is
        env['SCRIPT_NAME'] = url + ':' + orig_root + ':'
        return FileServer.__call__(self, env, start_response)

    def _fix_root(self, root):
        root = abspath(expanduser(root).rstrip('/'))
        if not root:
            root = '/'
        return root
