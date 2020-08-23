import torch as T 
import torch.nn as nn 
import torch.nn.functional as f 
import torch.optim as optim 
# from torchvision.datasets import EMNIST, ImageFolder
# from torchvision.transforms import ToTensor, CenterCrop, Compose
# from torch.utils.data import DataLoader, ConcatDataset
import numpy as np 
import matplotlib.pyplot as plt 

class CNNCell(nn.Module):

    def __init__(self, input_channels, output_channels):

        super(CNNCell, self).__init__()

        self.conv = nn.Conv2d(in_channels=input_channels, 
                                kernel_size=3, 
                                out_channels=output_channels)


        self.bn = nn.BatchNorm2d(num_features=output_channels)
        self.relu = nn.ReLU()


    def forward(self, batch_data):

        output = self.conv(batch_data)
        output = self.bn(output)
        output = self.relu(output)

        return output


class CNNNetwork(nn.Module):

    def __init__(self, lr, batch_size, n_classes, epochs, load):

        super(CNNNetwork, self).__init__()
        self.lr = lr
        self.load_model= load
        self.batch_size = batch_size
        self.n_classes = n_classes
        self.epochs = epochs
        self.device = T.device('cuda:0' if T.cuda.is_available() else 'cpu')
        self.loss_history = []
        self.acc_history = []

        self.cell1 = CNNCell(input_channels=3, output_channels=32)
        self.cell2 = CNNCell(input_channels=32, output_channels=32)
        self.cell3 = CNNCell(input_channels=32, output_channels=32)

        self.max_pool1 = nn.MaxPool2d(kernel_size=2)
        self.cell4 = CNNCell(input_channels=32, output_channels=64)
        self.cell5 = CNNCell(input_channels=64, output_channels=64)
        self.cell6 = CNNCell(input_channels=64, output_channels=64)

        self.max_pool2 = nn.MaxPool2d(kernel_size=2)

        Dropout = nn.Dropout

        self.network = nn.Sequential(self.cell1, self.cell2, self.cell3, self.max_pool1,
                                    self.cell4, self.cell5, self.cell6, self.max_pool2)
        
        # self.network.add(Dropout(.2))

        self.fc = nn.Linear(in_features=256, out_features=n_classes)
        self.loss = nn.CrossEntropyLoss()   # provides activation 

        self.optimizer = optim.Adam(self.parameters(), lr=self.lr)

        self.to(self.device)
        # self.get_data()

    def forward(self, batch_data):

        # batch_data = T.tensor(batch_data).to(self.device)
        batch_data = T.as_tensor(batch_data).to(self.device)
        output = self.network(batch_data)
        output = output.view(-1, 256)
        output = self.fc(output)

        return output


    def get_data(self):

        # custom dataset
        train_dir = './alphanumeric/training'
        train_data = ImageFolder(train_dir, transform=ToTensor())

        test_dir = './alphanumeric/testing'
        test_data = ImageFolder(test_dir,transform=ToTensor())

        self.train_data_loader = DataLoader(train_data, 
                                            batch_size=self.batch_size,
                                            shuffle=True,
                                            num_workers=8
                                            )
        
        self.test_data_loader = DataLoader(test_data,
                                           batch_size=self.batch_size,
                                           shuffle=True,
                                           num_workers=8)


    def save_checkpoint(self, state, filename="my_checkpoint.pth"):

        print("Saving checkpoint...")
        T.save(state, filename)


    def load_checkpoint(self, checkpoint):

        print("Loading checkpoint")
        self.load_state_dict(checkpoint['state_dict'])
        self.optimizer.load_state_dict(checkpoint['optimizer'])


    def _train(self):
        
        # load model state from a checkpoint
        if self.load_model:
            self.load_checkpoint(T.load('my_checkpoint.pth'))

        # tells Pytorch we're in training mode
        self.train()

        for i in range(self.epochs):

            ep_loss = 0 
            ep_acc = []

            # save a checkpoint every 4 iterations
            if i % 4 == 0 and i != 0:
                checkpoint = {'state_dict' : self.state_dict(), 'optimizer': self.optimizer.state_dict()}
                self.save_checkpoint(checkpoint)

            for j, (input, label) in enumerate(self.train_data_loader):

                self.optimizer.zero_grad()
                label = label.to(self.device)
                prediction = self.forward(input)
                classes = T.argmax(prediction, dim=1)

                wrong = T.where(classes != label, 
                        T.tensor([1.]).to(self.device),     
                        T.tensor([0.]).to(self.device))     
                acc = 1 - T.sum(wrong) / self.batch_size
                loss = self.loss(prediction, label)
                self.acc_history.append(acc.item())       
                ep_loss += loss.item()
                ep_acc.append(acc.item())

                loss.backward()
                self.optimizer.step()

            print('Finished epoch ', i, 'total loss %.4f training accuracy: %.4f' % \
                                        (ep_loss, np.mean(ep_acc)))
            self.loss_history.append(ep_loss)


    def _test(self):

      self.eval()

      ep_loss = 0
      ep_acc = []

      for j, (input, label) in enumerate(self.test_data_loader):

          label = label.to(self.device)
          prediction = self.forward(input)
          classes = T.argmax(prediction, dim=1)
          wrong = T.where(classes != label, 
                  T.tensor([1.]).to(self.device),     # where we send it if it's right
                  T.tensor([0.]).to(self.device))     # if it's wrong
          acc = 1 - T.sum(wrong) / self.batch_size
          loss = self.loss(prediction, label)

          ep_acc.append(acc.item())         # add the accuracy from the tensor
          ep_loss += loss.item()

      print('total loss %.4f accuracy %.4f' % (ep_loss, np.mean(ep_acc)))

 
if __name__ == '__main__':
    
    # setting load=1 will load the most recent checkpoint
    network = CNNNetwork(lr=0.00015, batch_size=64, epochs=50, n_classes=36, load=0)
    network._train()
    
    PATH = 'my_model.pth'
    T.save(network.state_dict(), PATH)

    plt.plot(network.loss_history)
    plt.show()

    plt.plot(network.acc_history)
    plt.show()

    network._test()