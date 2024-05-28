class DinnerItem:
    def __init__(self):
        self.name = ""
        self.description = ""
        self.prepTime = 0
        self.cookTime = 0
        self.steps = []
        self.tags = []
        self.id = "0"
        self.createdBy = 0
        self.lastModifiedBy = 0
        self.createdDate = None
        self.lastModifiedDate = None
        self.Version = 0

    def isValid(self):
        return True
